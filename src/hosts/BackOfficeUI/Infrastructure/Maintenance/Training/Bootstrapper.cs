namespace BackOfficeUI.Infrastructure.Maintenance.Training;

public static class Bootstrapper
{
    public static IServiceCollection BootstrapMaintenanceTraining(this IServiceCollection services)
    {
        services.AddSingleton<PendingReviewsGetter>();
        services.AddSingleton<PendingReviewsGetter>();
        return services;
    }
}