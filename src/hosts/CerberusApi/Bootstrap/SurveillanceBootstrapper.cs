using Cerberus.Surveillance.Features;
using Cerberus.Surveillance.Persistence;

namespace Cerberus.Api.Bootstrap;

internal static class SurveillanceBootstrapper
{
    public static IServiceCollection BootstrapSurveillance(this IServiceCollection services)
    {
        
        return services
            .BootstrapMartenSurveillancePersistence()
            .BootstrapCerberusSurveillanceFeatures();
    }
    
    public static RouteGroupBuilder BootstrapSurveillanceRouting(this RouteGroupBuilder app)
    {
        var apiGroup = app.MapGroup("/api");
        apiGroup
            .SetupSurveillanceRouting();
        return app;
    }
}