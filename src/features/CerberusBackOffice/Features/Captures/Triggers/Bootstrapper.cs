using System.Collections.Specialized;
using Cerberus.BackOffice.Features.Captures.Triggers.Jobs;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Quartz;

namespace Cerberus.BackOffice.Features.Captures.Triggers;

public static class Bootstrapper
{
    public static IServiceCollection BoostrapTriggers(this IServiceCollection services, IConfiguration configuration)
    {
        //Configure Quartz
        services.AddQuartz(q =>
        {
           q.UsePersistentStore(opt =>
           {
             
                opt.UseProperties = true;
                opt.Properties["quartz.jobStore.type"] = "Quartz.Impl.AdoJobStore.JobStoreTX, Quartz";
                opt.Properties["quartz.serializer.type"] = "json"; // Add this line
                opt.Properties["quartz.jobStore.useProperties"] = "true";
                opt.Properties["quartz.jobStore.dataSource"] = "default";
                opt.Properties["quartz.jobStore.tablePrefix"] = "Quartz.QRTZ_";
                opt.Properties["quartz.jobStore.driverDelegateType"] = "Quartz.Impl.AdoJobStore.PostgreSQLDelegate, Quartz";
                opt.Properties["quartz.dataSource.default.connectionString"] = configuration.GetSection("Backends:PostgresQL:Quartz").Value!;
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
           q.AddJob<CaptureJob>(configurator =>
           {
               configurator
                   .WithIdentity(CaptureJob.JobKey)
                   .StoreDurably()
                   .Build();
           });

        });
        //Configure Quartz PostrgresQL Storage
        services.AddQuartzHostedService(options =>
        {
            options.WaitForJobsToComplete = true;
        });
        return services;
    }
}