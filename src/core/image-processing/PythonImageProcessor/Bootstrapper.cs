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
        Environment.SetEnvironmentVariable("PYTHONNET_PYDLL", @"C:\Python312\python312.dll");
        PythonEngine.Initialize();
        PythonEngine.BeginAllowThreads();
        return services;
    }
}
