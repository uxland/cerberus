using System.Collections.Concurrent;
using System.Diagnostics;
using Cerverus.Maintenance.Features.Features.Analysis;
using Cerverus.Maintenance.Features.Features.Analysis.AnalyzeCapture;
using NodaTime;
using Python.Runtime;

namespace Cerverus.Core.PythonImageProcessor;

public class FilterExecutor: IFilterExecutor
{
    
    public bool Execute(string script, byte[] imageBuffer)
    {
        using ((Py.GIL()))
        {
            using (var scope = Py.CreateScope())
            {
                var compiledScript = PythonEngine.Compile(script);
                scope.Execute(compiledScript);
                dynamic np = Py.Import("numpy");
                var pythonBuffer = np.asarray(imageBuffer);
                var function = scope.Get("process_image");
                var result = function.Invoke(pythonBuffer);
                return result.As<bool>();
            }
           
        }
    }
}

public interface IFilterExecutor
{
    public bool Execute(string script, byte[] imageBuffer);
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

    public Task<List<FilterResult>> ExecuteFilters(List<string> filters, string capturePath)
    {
        return Task.Run(async() =>
        {
            var buffer = await ReadFileAsync(capturePath);
            var results = new ConcurrentBag<FilterResult>();
            Parallel.ForEach(filters, filter =>
            {
                var startTime = SystemClock.Instance.GetCurrentInstant().InUtc();
                var stopwatch = Stopwatch.StartNew();
                var result = _filterExecutor.Execute(script, buffer);
                stopwatch.Stop();
                results.Add(new FilterResult(filter, "Filter description", startTime, Duration.FromTimeSpan(stopwatch.Elapsed), result));
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