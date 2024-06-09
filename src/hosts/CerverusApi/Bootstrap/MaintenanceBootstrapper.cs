using Cerverus.Core.PythonImageProcessor;
using Cerverus.Maintenance.Features;
using Cerverus.Maintenance.Persistence;

namespace Cerverus.Api.Bootstrap;

public static class MaintenanceBootstrapper
{
    public static IServiceCollection BootstrapMaintenance(this IServiceCollection services)
    {
        return services
            .BootstrapPythonImageProcessor()
            .BootstrapMartenMaintenancePersistence()
            .BootstrapCerverusMaintenanceFeatures();
    }
}