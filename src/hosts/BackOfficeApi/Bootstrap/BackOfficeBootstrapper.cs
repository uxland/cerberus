using Cerverus.BackOffice.Persistence;

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