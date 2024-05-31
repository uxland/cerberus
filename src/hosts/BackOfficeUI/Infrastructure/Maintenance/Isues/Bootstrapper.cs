namespace BackOfficeUI.Infrastructure.Maintenance.Isues;

public static class Bootstrapper
{
    public static IServiceCollection BootstrapMaintenanceIssues(this IServiceCollection services)
    {
        return services.AddSingleton<IssueSummaryGetter>()
            .AddSingleton<MaintenanceIssueDetailGetter>()
            .AddSingleton<MaintenanceIssueCommander>();
    }
}