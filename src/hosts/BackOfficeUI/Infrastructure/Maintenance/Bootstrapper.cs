using BackOfficeUI.Infrastructure.Maintenance.Isues;
using BackOfficeUI.Infrastructure.Maintenance.Training;

namespace BackOfficeUI.Infrastructure.Maintenance;

public static class Bootstrapper
{
    public static IServiceCollection BootstrapMaintenance(this IServiceCollection services)
    {
        return services.BootstrapMaintenanceIssues();
    }
}