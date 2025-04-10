using Cerberus.BackOffice.Features.OrganizationalStructure.HierarchyItems.ListLocationSubHierarchy;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.HierarchyItems;

internal static class Bootstrapper
{
    public static RouteGroupBuilder SetupHierarchyItemsRouting(this RouteGroupBuilder app)
    {
        var group = app.MapGroup("/hierarchy-items");
        group.UseListLocationSubHierarchy();
        return app;
    }
}