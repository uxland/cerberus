using Wolverine;

namespace Cerberus.Api.Setup;

public static class WolverineSetup
{
    public static IHostBuilder SetupWolverine(this ConfigureHostBuilder hostBuilder)
    {
        hostBuilder.UseWolverine(opts =>
        {
            opts.Policies.MessageExecutionLogLevel(LogLevel.None);
            opts.Policies.MessageSuccessLogLevel(LogLevel.None);
            opts.Policies.LogMessageStarting(LogLevel.None);
            opts.Policies.AutoApplyTransactions();
        });
        return hostBuilder;
    }
}