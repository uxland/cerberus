using Cerberus.Core.KeycloakClient;
using Cerberus.Signaling.Api.Bootstrap;
using Cerberus.Signaling.Api.Services;

namespace Cerberus.Signaling.Api;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddAuthorization();
        builder.Services.BootstrapJsonSerialization();
        builder.Services.UseKeycloakClient(builder.Configuration, "/api/signaling-hub");
        builder.Services.UseCors();
        builder.Services.AddSignalR();
        builder.Services.AddLogging();
        builder.Services.UseServices();
        

        var app = builder.Build();
        
        app.UseCors("AllowLocalReact");
        app.UseHttpsRedirection();

        app.UseAuthentication()
            .UseAuthorization();
        app.BootstrapContentServer(builder);
        
        var apiGroup = app.MapGroup("/api");
        apiGroup.MapHub<WebRtcSignalingHub>("/signaling-hub");
        app.Run();
    }
}