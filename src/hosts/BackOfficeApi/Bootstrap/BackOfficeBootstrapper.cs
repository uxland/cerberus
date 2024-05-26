using Cerverus.BackOffice.Persistence;
using Cerverus.Features;

namespace Cerverus.BackOffice.Api.Bootstrap;

public static class BackOfficeBootstrapper
{
    public static IServiceCollection BootstrapBackOffice(this IServiceCollection services)
    {
        
        return services
            .AddMartenBackOfficePersistence()
            .UseCerverusBackOfficeFeatures();
    }
}