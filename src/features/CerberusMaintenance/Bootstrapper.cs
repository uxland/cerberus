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
}