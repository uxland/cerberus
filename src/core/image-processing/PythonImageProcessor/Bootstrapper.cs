using Cerverus.Maintenance.Features.Features.Analysis.AnalyzeCapture;
using Microsoft.Extensions.DependencyInjection;
using Python.Runtime;

namespace Cerverus.Core.PythonImageProcessor;

public static class Bootstrapper
{
    public static IServiceCollection BootstrapPythonImageProcessor(this IServiceCollection services)
    {
        return services
            .InitPythonEngine()
            .AddSingleton<IFiltersExecutor, FiltersExecutor>();
    }
    
    private static IServiceCollection InitPythonEngine(this IServiceCollection services)
    {
        //Environment.SetEnvironmentVariable("PYTHONNET_PYDLL", "/opt/homebrew/bin/python3");
        if(Environment.GetEnvironmentVariable("PYTHONNET_PYDLL") == null)
            Environment.SetEnvironmentVariable("PYTHONNET_PYDLL", @"C:\Python312\python312.dll");
        //Environment.SetEnvironmentVariable("PYTHONPATH", @"C:\Python312\DLL");
        //PythonEngine.PythonHome =  @"C:\Python312";
       // PythonEngine.PythonPath = @"C:\Python312;C:\Python312\DLLs;C:\Python312\Lib;C:\Python312\Lib\site-packages";
        PythonEngine.Initialize();
       PythonEngine.BeginAllowThreads();
        return services;
    }
}
