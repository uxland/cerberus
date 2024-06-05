using System.Collections.Concurrent;
using System.Diagnostics;
using Cerverus.Maintenance.Features.Features.Analysis;
using Cerverus.Maintenance.Features.Features.Analysis.AnalyzeCapture;
using Cerverus.Maintenance.Features.Features.Analysis.Filters;
using NodaTime;
using Python.Runtime;
using Spectre.Console;

namespace Cerverus.Core.PythonImageProcessor;

public class FilterExecutor: IFilterExecutor
{
    
    public (bool, string?) Execute(string script, byte[] imageBuffer)
    {
        try
        {
            using (Py.GIL())
            {
                using (var scope = Py.CreateScope())
                {
                    var compiledScript = PythonEngine.Compile(script);
                    scope.Execute(compiledScript);
                    dynamic np = Py.Import("numpy");
                    var pythonBuffer = np.asarray(imageBuffer);
                    var function = scope.Get("process_image");
                    var result = function.Invoke(pythonBuffer);
                    return (result.As<bool>(), string.Empty);
                }
           
            }
        }
        catch (Exception e)
        {
            return (false, e.Message);
        }
        
    }
}

public interface IFilterExecutor
{
    public (bool Success, string? Message) Execute(string script, byte[] imageBuffer);
}

public class FiltersExecutor: IFiltersExecutor
{
    private const string script = @"import random

def process_image(byte_array):
    # Optionally seed the random number generator for more unpredictable results
    # random.seed(sum(byte_array))  # Sum can be a simple way to use the byte data

    # Return a random boolean
    return random.choice([True, False])";

    private readonly IFilterExecutor _filterExecutor = new FilterExecutor();

    public Task<List<FilterResult>> ExecuteFilters(IReadOnlyList<Filter> filters, string capturePath)
    {
        return Task.Run(async() =>
        {
            var buffer = await ReadFileAsync(capturePath);
            var results = new ConcurrentBag<FilterResult>();
            Parallel.ForEach(filters, filter =>
            {
                var startTime = SystemClock.Instance.GetCurrentInstant();
                var stopwatch = Stopwatch.StartNew();
                var result = _filterExecutor.Execute(filter.Script, buffer);
                stopwatch.Stop();
                results.Add(new FilterResult(filter.Id, filter.Description, startTime, Duration.FromTimeSpan(stopwatch.Elapsed), result.Success, result.Message));
            });
            return results.ToList();
        });
    }
    
    private static async Task<byte[]> ReadFileAsync(string filePath)
    {
        var rootPath = "C:/Cerverus/Snapshots";
        var path = Path.Combine(rootPath, filePath);
        await using var file = File.OpenRead(path);
        var buffer = new byte[file.Length];
        int read = 0;
        do
        {
            read += await file.ReadAsync(buffer.AsMemory(read, buffer.Length - read));
        }while (read < buffer.Length);
        return buffer;
    }
}