using Cerverus.Features.Features.OrganizationalStructure.Camera.SetupCamera;
using Cerverus.Features.Features.OrganizationalStructure.Location;
using Microsoft.Extensions.DependencyInjection;

namespace Cerverus.Features.Features.OrganizationalStructure.Shared;

internal static class DependencyInjection
{
    internal static IServiceCollection UseSharedOrganizationStructure(this IServiceCollection services)
    {
        return
            services.AddScoped<IHierarchyItemPathProvider, HierarchicalItemPathProvider>()
                .AddScoped<HierarchySetupCommandFactory>()
                .AddScoped<IHierarchySetupCommandFactoryItem, SetupCameraFactory>()
                .AddScoped<IHierarchySetupCommandFactoryItem, SetupLocationFactory>()
                .AddScoped<ILocationSettingsGetter, LocationSettingsGetter>();
        
    }
}