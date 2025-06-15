using Cerberus.BackOffice.Features.OrganizationalStructure.Camera.Streaming.JoinStream;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Camera.Streaming;

internal static class Bootstrapper
{
    public static RouteGroupBuilder SetupCameraStreamingRouting(this RouteGroupBuilder app)
    {
        app.UseJoinStream();
        return app;
    }
    public static IServiceCollection UseCameraStreaming(this IServiceCollection serviceCollection, IConfiguration configuration)
    {
        serviceCollection.Configure<StreamingOptions>(configuration.GetSection("Backends:MediaServer"));
        return serviceCollection
            .ConfigureMediaServerHttpClient(configuration)
            .AddScoped<IStreamRegistry, StreamingRegistry>();
    }

    private static IServiceCollection ConfigureMediaServerHttpClient(this IServiceCollection serviceCollection,
        IConfiguration configuration)
    {
        var baseUrl = configuration["Backends:MediaServer:BaseUrl"]!;
        serviceCollection.AddHttpClient<ICameraStreamingController, CameraStreamingController>(client =>
            {
                client.BaseAddress = new Uri(baseUrl);
            })
            .ConfigurePrimaryHttpMessageHandler(() => new HttpClientHandler
            {
#if DEBUG
                ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator       
#endif
         
            });
        return serviceCollection;
    }
}