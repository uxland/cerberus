using Quartz;

namespace Cerberus.Api.Bootstrap;

public static class QuartzBootstrapper
{
    public static IServiceCollection BootstrapQuartz(this IServiceCollection services, IConfiguration configuration)
    {
        return services.AddQuartz(q =>
        {
            q.ConfigureQuartzStore(configuration);
        }).AddQuartzHostedService(opt => opt.WaitForJobsToComplete = true);
    }

    private static IServiceCollectionQuartzConfigurator ConfigureQuartzStore(
        this IServiceCollectionQuartzConfigurator services, IConfiguration configuration)
    {
        services.UsePersistentStore(opt =>
        {

            opt.UseProperties = true;
            opt.Properties["quartz.jobStore.type"] = "Quartz.Impl.AdoJobStore.JobStoreTX, Quartz";
            opt.Properties["quartz.serializer.type"] = "json"; // Add this line
            opt.Properties["quartz.jobStore.useProperties"] = "true";
            opt.Properties["quartz.jobStore.dataSource"] = "default";
            opt.Properties["quartz.jobStore.tablePrefix"] = "Quartz.QRTZ_";
            opt.Properties["quartz.jobStore.driverDelegateType"] = "Quartz.Impl.AdoJobStore.PostgreSQLDelegate, Quartz";
            opt.Properties["quartz.dataSource.default.connectionString"] =
                configuration.GetSection("Backends:PostgresQL:Quartz").Value!;
            opt.Properties["quartz.dataSource.default.provider"] = "Npgsql";

            opt.UsePostgres(c =>
            {
                c.ConnectionString = configuration.GetSection("Backends:PostgresQL:Quartz").Value!;
                c.TablePrefix = "Quartz.QRTZ_";
            });
            opt.UseClustering(
                c =>
                {
                    c.CheckinMisfireThreshold = TimeSpan.FromSeconds(20);
                    c.CheckinInterval = TimeSpan.FromSeconds(10);
                }
            );
        });
        return services;
    }
}