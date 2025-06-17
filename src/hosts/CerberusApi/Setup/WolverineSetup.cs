using JasperFx;
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
            //opts.Services.Cri
            opts.Services.CritterStackDefaults(x =>
                {
                    x.Production.GeneratedCodeMode = JasperFx.CodeGeneration.TypeLoadMode.Dynamic;
                    x.Production.ResourceAutoCreate = AutoCreate.CreateOrUpdate;
                    x.Production.AssertAllPreGeneratedTypesExist = true;
                    x.Development.GeneratedCodeMode = JasperFx.CodeGeneration.TypeLoadMode.Dynamic;
                    x.Development.ResourceAutoCreate = AutoCreate.All;
                }
            );
        });
        return hostBuilder;
    }
}