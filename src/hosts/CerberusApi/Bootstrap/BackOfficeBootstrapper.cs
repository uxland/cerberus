using Cerberus.BackOffice;
using Cerberus.BackOffice.Persistence;

namespace Cerberus.Api.Bootstrap;

public static class BackOfficeBootstrapper
{
    public static IServiceCollection BootstrapBackOffice(this IServiceCollection services)
    {
        
        return services
            .AddMartenBackOfficePersistence()
            .UseCerberusBackOfficeFeatures();
    }
}