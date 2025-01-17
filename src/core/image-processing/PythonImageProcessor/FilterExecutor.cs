using System.Collections.Concurrent;
using System.Diagnostics;
using System.Text.Json;
using Cerberus.BackOffice.Features.Captures.CaptureSnapshots;
using Cerberus.Maintenance.Features.Features.Analysis;
using Cerberus.Maintenance.Features.Features.Analysis.AnalyzeCapture;
using Microsoft.Extensions.Options;
using NodaTime;
using Python.Runtime;

namespace Cerberus.Core.PythonImageProcessor;

public class FilterExecutor : IFilterExecutor
{
    public  FilterExecutionResult Execute(string script, dynamic imageBuffer, string jsonArgs, AnalysisMode mode)
    {
        try
        {
            using (Py.GIL())
            {
                using (var scope = Py.CreateScope())
                {
                    var compiledScript = PythonEngine.Compile(script);
                    scope.Execute(compiledScript);
                    dynamic json = Py.Import("json");
                    var args = json.loads(jsonArgs);
                    var function = scope.Get("process_image");
                    var result = function.Invoke(imageBuffer, args, new PyString(mode.ToString()));
                    var success = ((PyObject)result.GetAttr("Success")).As<bool>();
                    
                    string? filteredImageBase64 = null;
                    if (result.HasAttr("FilteredImage"))
                    {
                        var filteredImage = (PyObject)result.GetAttr("FilteredImage");
                        if ( filteredImage != PyObject.None)
                        {
                            var filteredImageBuffer = filteredImage.As<byte[]>();
                            filteredImageBase64 = $"data:image/jpeg;base64,{Convert.ToBase64String(filteredImageBuffer)}";
                        }
                    }

                    return new FilterExecutionResult(success, filteredImageBase64, string.Empty);
                }
            }
        }
        catch (Exception e)
        {
            return new FilterExecutionResult(false, null, e.Message);
        }
    }

    public dynamic CreatePythonBuffer(byte[] imageBuffer)
    {
        try
        {
            using (Py.GIL())
            {
                using (var scope = Py.CreateScope())
                {
                    dynamic np = Py.Import("numpy");
                    dynamic ctypes = Py.Import("ctypes");
                    dynamic lenFunction = PythonEngine.Eval("len");
                    var pythonBuffer = np.asarray(imageBuffer);
                    var buffer = (ctypes.c_char * lenFunction(pythonBuffer)).from_buffer(pythonBuffer);
                    return buffer;
                }
            }
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }
}

public record FilterExecutionResult(bool Success, string? FilteredImageBase64 = null, string? Message = null);
public interface IFilterExecutor
{
    public FilterExecutionResult Execute(string script, dynamic imageBuffer,
        string jsonArgs, AnalysisMode mode);
    public dynamic CreatePythonBuffer(byte[] imageBuffer);
}

public class FiltersExecutor(IOptions<SnapshotCaptureSettings> captureSettings) : IFiltersExecutor
{
    private const string script = @"import random

def process_image(byte_array):
    # Optionally seed the random number generator for more unpredictable results
    # random.seed(sum(byte_array))  # Sum can be a simple way to use the byte data

    # Return a random boolean
    return random.choice([True, False])";

    private readonly FilterExecutor _filterExecutor = new();

    public Task<List<FilterResult>> ExecuteFilters(IReadOnlyList<MaintenanceAnalysisArgs> args)
    {
        return Task.Run(async () =>
        {
            var buffer = await ReadFileAsync(args.First().FilePath);
            var pythonBuffer = _filterExecutor.CreatePythonBuffer(buffer);
            var results = new ConcurrentBag<FilterResult>();
            Parallel.ForEach(args, analysisArg =>
            {
                var (filter, filterArgs, mode, _ ) = analysisArg;
                var jsonArgs = JsonSerializer.Serialize(filterArgs);
                var startTime = SystemClock.Instance.GetCurrentInstant();
                var stopwatch = Stopwatch.StartNew();
                var result = _filterExecutor.Execute(filter.Script, pythonBuffer, jsonArgs, mode);
                stopwatch.Stop();
                results.Add(new FilterResult(filter.Id, filter.Description, startTime,
                    Duration.FromTimeSpan(stopwatch.Elapsed), result.Success, result.FilteredImageBase64, result.Message));
            });
            return results.ToList();
        });
    }

    private async Task<byte[]> ReadFileAsync(string filePath)
    {
        var path = Path.Combine(captureSettings.Value.FolderRoot, filePath);
        await using var file = File.OpenRead(path);
        var buffer = new byte[file.Length];
        var read = 0;
        do
        {
            read += await file.ReadAsync(buffer.AsMemory(read, buffer.Length - read));
        } while (read < buffer.Length);

        return buffer;
    }
}