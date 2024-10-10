using Cerberus.Maintenance.Features.Features.Shared;
using Microsoft.Extensions.DependencyInjection;
using Wolverine.Attributes;

[assembly: WolverineModule]
namespace Cerberus.Maintenance.Features;

public static class Bootstrapper
{
    public static IServiceCollection BootstrapCerberusMaintenanceFeatures(this IServiceCollection services)
    {
        return services;
    }
    
    private static IServiceCollection SetUpAuthorization(this IServiceCollection services)
    {
        return services.AddAuthorization(options =>
        {
            options.AddPolicy(MaintenancePolicies.User, policy => policy.RequireClaim("roles", MaintenanceRoles.Admin, MaintenanceRoles.Manager, MaintenanceRoles.Operator));
            options.AddPolicy(MaintenancePolicies.Operations, policy => policy.RequireClaim("roles", MaintenanceRoles.Operator, MaintenanceRoles.Manager));;
        });
    }
}