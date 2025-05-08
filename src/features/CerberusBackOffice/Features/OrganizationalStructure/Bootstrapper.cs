using Cerberus.BackOffice.Features.OrganizationalStructure.Camera;
using Cerberus.BackOffice.Features.OrganizationalStructure.HierarchyItems;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Cerberus.BackOffice.Features.OrganizationalStructure;

internal static class Bootstrapper
{
    public static RouteGroupBuilder SetupOrganizationalStructureRouting(this RouteGroupBuilder app)
    {
        var group = app.MapGroup("/organizational-structure");
        group.SetupHierarchyItemsRouting();
        group.SetupCameraRouting();
        return app;
    }
    
    public static IServiceCollection UseOrganizationalStructure(this IServiceCollection serviceCollection, IConfiguration configuration)
    {
        return serviceCollection
            .UseCameras(configuration);
    }
}