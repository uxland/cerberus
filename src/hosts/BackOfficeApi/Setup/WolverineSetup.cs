using Wolverine;

namespace Cerverus.BackOffice.Api.Setup;

public static class WolverineSetup
{
    public static IHostBuilder SetupWolverine(this ConfigureHostBuilder hostBuilder)
    {
        hostBuilder.UseWolverine(opts =>
        {
            opts.Policies.MessageExecutionLogLevel(LogLevel.Error);
            opts.Policies.MessageSuccessLogLevel(LogLevel.Error);
            opts.Policies.AutoApplyTransactions();
        });
        return hostBuilder;
    }
}