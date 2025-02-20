using System.Text.Json.Serialization.Metadata;
using Cerberus.Surveillance.Features.Features.Operation;
using Cerberus.Surveillance.Features.Features.Operation.List;
using Cerberus.Surveillance.Features.Features.Shared;
using Microsoft.AspNetCore.Builder;
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
    
    public static WebApplication SetupSurveillanceRouting(this WebApplication app)
    {
        return app.SetupOperationRouting();
    }

    public static DefaultJsonTypeInfoResolver UseSurveillanceSerialization(this DefaultJsonTypeInfoResolver resolver)
    {
        return resolver.UseOperationJsonTypeInfo();
    }
}