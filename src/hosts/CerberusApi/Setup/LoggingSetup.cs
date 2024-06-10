using Serilog;
using Serilog.Events;

namespace Cerberus.Api.Setup;

public static class LoggingSetup
{
    public static IServiceCollection UseLogging(this IServiceCollection services)
    {
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Debug()
            .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
            .MinimumLevel.Override("Npgsql", LogEventLevel.Warning)
            .MinimumLevel.Override("Wolverine", LogEventLevel.Warning)
            .Enrich.FromLogContext()
            .WriteTo.Console()
            .CreateLogger();
        services.AddSerilog(Log.Logger);
        return services;
    }
}