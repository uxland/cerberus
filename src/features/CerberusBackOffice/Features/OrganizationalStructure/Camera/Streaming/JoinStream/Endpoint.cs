using Cerberus.BackOffice.Features.OrganizationalStructure.Camera.JoinStream;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Wolverine;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Camera.Streaming.JoinStream;

public static class Endpoint
{
    public static RouteGroupBuilder UseJoinStream(this RouteGroupBuilder app)
    {
        app.MapPut("{cameraId}:join-stream", async (string cameraId, IMessageBus bus) =>
        {
            var result = await bus.InvokeAsync<JoinStreamResponse>(new OrganizationalStructure.Camera.JoinStream.JoinStream(cameraId));
            return Results.Ok(result);
        });
        return app;
    }
    
}