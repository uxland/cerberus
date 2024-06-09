using System.Runtime.InteropServices;
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
        SetEnvironmentVariables();
        PythonEngine.Initialize();
        PythonEngine.BeginAllowThreads();
        return services;
    }
    
    private static void SetEnvironmentVariables()
    {
        if(!string.IsNullOrEmpty(Environment.GetEnvironmentVariable("PYTHONNET_PYDLL")))
            return;
        if(File.Exists("/tmp/python_version"))
            SetEnvironmentVariablesFromFile();
        else 
            SetEnvironmentVariablesFromPlatform();
    }

    private static void SetEnvironmentVariablesFromPlatform()
    {
        var pythonDllPath = string.Empty;
        if(RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
            pythonDllPath = @"C:\Python312\python312.dll";
        else if(RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
            pythonDllPath = @"C:\Python312\python312.dll";
        else if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
            pythonDllPath = "/opt/homebrew/bin/python3";
        Environment.SetEnvironmentVariable("PYTHONNET_PYDLL", pythonDllPath, EnvironmentVariableTarget.Process);
    }
    private static void SetEnvironmentVariablesFromFile()
    {
        var pythonVersion = File.ReadAllText("/tmp/python_version").Trim();
        var architecture = RuntimeInformation.ProcessArchitecture == Architecture.X64 ? "x86_64" : "aarch64";
        var pythonNetDll = $"/usr/lib/{architecture}-linux-gnu/libpython{pythonVersion}.so";
        Environment.SetEnvironmentVariable("PYTHONNET_PYDLL", pythonNetDll, EnvironmentVariableTarget.Process);
        var currentPath = Environment.GetEnvironmentVariable("PATH");
        //add ffmpeg path to PATH
        currentPath += $"{Path.PathSeparator}/user/bin/ffmpeg";
        //add python lib path to PATH
        currentPath += $"{Path.PathSeparator}/usr/local/bin/python{pythonVersion}{Path.PathSeparator}/usr/bin{Path.PathSeparator}/usr/local/bin";
        Environment.SetEnvironmentVariable("PATH", currentPath, EnvironmentVariableTarget.Process);
    }
}
