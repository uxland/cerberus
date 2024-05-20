using Microsoft.Extensions.DependencyInjection;
using Python.Runtime;

namespace Cerverus.Core.PythonImageProcessor;

public static class DependencyInjection
{
    public static IServiceCollection UsePythonImageProcessor(this IServiceCollection services)
    {
        return services.InitPythonEngine();
    }
    
    private static IServiceCollection InitPythonEngine(this IServiceCollection services)
    {
        Environment.SetEnvironmentVariable("PYTHONNET_PYDLL", "/opt/homebrew/bin/python3");
        PythonEngine.Initialize();
        PythonEngine.BeginAllowThreads();
        return services;
    }
}
