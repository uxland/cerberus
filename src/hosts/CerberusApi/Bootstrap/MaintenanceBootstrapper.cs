using Cerberus.Core.PythonImageProcessor;
using Cerberus.Maintenance.Features;
using Cerberus.Maintenance.Persistence;

namespace Cerberus.Api.Bootstrap;

public static class MaintenanceBootstrapper
{
    public static IServiceCollection BootstrapMaintenance(this IServiceCollection services)
    {
        return services
            .BootstrapPythonImageProcessor()
            .BootstrapMartenMaintenancePersistence()
            .BootstrapCerberusMaintenanceFeatures();
    }
}