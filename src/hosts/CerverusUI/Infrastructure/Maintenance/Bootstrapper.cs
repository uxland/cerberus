using Cerverus.UI.Infrastructure.Maintenance.Isues;

namespace Cerverus.UI.Infrastructure.Maintenance;

public static class Bootstrapper
{
    public static IServiceCollection BootstrapMaintenance(this IServiceCollection services)
    {
        return services.BootstrapMaintenanceIssues();
    }
}