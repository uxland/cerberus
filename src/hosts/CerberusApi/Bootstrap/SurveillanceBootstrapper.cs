using Cerberus.Surveillance.Features;
using Cerberus.Surveillance.Persistence;
using Marten;

namespace Cerberus.Api.Bootstrap;

internal static class SurveillanceBootstrapper
{
    public static IServiceCollection BootstrapSurveillance(this IServiceCollection services, MartenServiceCollectionExtensions.MartenConfigurationExpression martenConfiguration)
    {
        
        return services
            .BootstrapMartenSurveillancePersistence(martenConfiguration)
            .BootstrapCerberusSurveillanceFeatures();
    }
    
    public static RouteGroupBuilder BootstrapSurveillanceRouting(this RouteGroupBuilder app)
    {
        return app
            .SetupSurveillanceRouting();
    }
}