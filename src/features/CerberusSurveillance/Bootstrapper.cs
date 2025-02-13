using Cerberus.Surveillance.Features.Features.Shared;
using Microsoft.Extensions.DependencyInjection;
using Wolverine.Attributes;

[assembly: WolverineModule]
namespace Cerberus.Surveillance.Features;


public static class Bootstrapper
{
    public static IServiceCollection BootstrapCerberusSurveillanceFeatures(this IServiceCollection services)
    {
        return services.SetUpAuthorization();
    }
    
    private static IServiceCollection SetUpAuthorization(this IServiceCollection services)
    {
        return services.AddAuthorization(options =>
        {
            options.AddPolicy(SurveillancePolicies.User, policy => policy.RequireClaim("roles", SurveillanceRoles.Admin, SurveillanceRoles.Manager, SurveillanceRoles.Agent));
            options.AddPolicy(SurveillancePolicies.Management, policy => policy.RequireClaim("roles", SurveillanceRoles.Admin, SurveillanceRoles.Manager));
        });
        return services;
    }
}