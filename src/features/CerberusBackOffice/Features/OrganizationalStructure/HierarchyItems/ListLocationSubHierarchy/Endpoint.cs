using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Wolverine;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.HierarchyItems.ListLocationSubHierarchy;

public static class Endpoint
{
    public static RouteGroupBuilder UseListLocationSubHierarchy(this RouteGroupBuilder app)
    {
        app.MapGet("/{id}/descendants", async (string id, IMessageBus messageBus) =>
        {
            var query = new ListLocationSubHierarchy(id);
            var result = await messageBus.InvokeAsync<List<LocationHierarchicalItem>>(query);
            return Results.Ok(result);
        });
        return app;
    }
}