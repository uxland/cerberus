using Cerberus.UI.Infrastructure.Maintenance.Isues;

namespace Cerberus.UI.Infrastructure.Maintenance;

public static class Bootstrapper
{
    public static IServiceCollection BootstrapMaintenance(this IServiceCollection services)
    {
        return services.BootstrapMaintenanceIssues();
    }
}