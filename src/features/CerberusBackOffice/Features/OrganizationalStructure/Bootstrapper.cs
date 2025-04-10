using Cerberus.BackOffice.Features.OrganizationalStructure.HierarchyItems;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;

namespace Cerberus.BackOffice.Features.OrganizationalStructure;

internal static class Bootstrapper
{
    public static RouteGroupBuilder SetupOrganizationalStructureRouting(this RouteGroupBuilder app)
    {
        var group = app.MapGroup("/organizational-structure");
        group.SetupHierarchyItemsRouting();
        return app;
    }
}