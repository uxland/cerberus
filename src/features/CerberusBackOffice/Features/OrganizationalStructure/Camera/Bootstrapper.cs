using Cerberus.BackOffice.Features.OrganizationalStructure.Camera.JoinStream;
using Cerberus.BackOffice.Features.OrganizationalStructure.Camera.Streaming;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Camera;

internal static class Bootstrapper
{
    public static RouteGroupBuilder SetupCameraRouting(this RouteGroupBuilder app)
    {
        var group = app.MapGroup("/cameras");
        group.SetupCameraStreamingRouting();
        return app;
    }

    public static IServiceCollection UseCameras(this IServiceCollection serviceCollection, IConfiguration configuration)
    {
        return serviceCollection.UseCameraStreaming(configuration);
    }
}