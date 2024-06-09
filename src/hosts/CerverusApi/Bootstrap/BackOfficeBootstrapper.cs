using Cerverus.BackOffice;
using Cerverus.BackOffice.Persistence;

namespace Cerverus.Api.Bootstrap;

public static class BackOfficeBootstrapper
{
    public static IServiceCollection BootstrapBackOffice(this IServiceCollection services)
    {
        
        return services
            .AddMartenBackOfficePersistence()
            .UseCerverusBackOfficeFeatures();
    }
}