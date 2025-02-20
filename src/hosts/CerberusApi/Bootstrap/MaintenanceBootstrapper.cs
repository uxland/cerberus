using Cerberus.Core.PythonImageProcessor;
using Cerberus.Maintenance.Features;
using Cerberus.Maintenance.Persistence;
using Cerberus.Surveillance.Persistence;
using Marten;

namespace Cerberus.Api.Bootstrap;

public static class MaintenanceBootstrapper
{
    public static IServiceCollection BootstrapMaintenance(this IServiceCollection services,
        MartenServiceCollectionExtensions.MartenConfigurationExpression martenConfiguration)
    {
        return services
            .BootstrapPythonImageProcessor()
            .BootstrapMartenMaintenancePersistence()
            .BootstrapCerberusMaintenanceFeatures();
    }
}