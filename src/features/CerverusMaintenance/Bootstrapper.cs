using Microsoft.Extensions.DependencyInjection;
using Wolverine.Attributes;

[assembly: WolverineModule]
namespace Cerverus.Maintenance.Features;

public static class Bootstrapper
{
    public static IServiceCollection BootstrapCerverusMaintenanceFeatures(this IServiceCollection services)
    {
        return services;
    }
}