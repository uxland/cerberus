using Cerberus.Api.Bootstrap;
using Cerberus.Api.Bootstrap.OpenApi;
using Cerberus.Api.Setup;
using Cerberus.Core.KeycloakClient;
using Cerberus.Core.MartenPersistence;
using Cerberus.Core.XabeFFMpegClient;
using Cerberus.Surveillance.Features.Features.Shared.Specs;
using SignalRClientPublisher;

namespace Cerberus.Api;

public class Startup(WebApplicationBuilder builder)
{
    private static string[] CORS_ALLOWED_HOSTS =
    [
        "localhost",
        "cerberus-ui",
        "cerberus-react-ui"
    ];
    public void ConfigureServices(IServiceCollection services)
    {
        services.UseKeycloakClient(builder.Configuration, "/cerberus-hub")
            .BootstrapMvc()
            .BootstrapOpenApi();
        services.AddSignalR();
        services.AddCors(options =>
        {
            options.AddPolicy("AllowLocalReact",
                builder =>
                {
                    builder
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                    builder.SetIsOriginAllowed(s =>
                    {
                        var uri = new Uri(s);
                        return CORS_ALLOWED_HOSTS.Contains(uri.Host);
                    });
                });
            
        });

        builder.Host.SetupWolverine();
        
        var martenConfiguration = services
            .SetupConfigurations(builder.Configuration)
            .UseLogging()
            .BootstrapXabeFFMpegClient()
            .UseMartenPersistence(builder.Configuration, builder.Environment, new SpecJsonConverterFactory());
        services
            .UseSignalRClientPublisher()
            .BootstrapServices()
            .BootstrapQuartz(builder.Configuration)
            .BootstrapBackOffice(builder.Configuration, martenConfiguration)
            .BootstrapMaintenance()
            .BootstrapSurveillance(martenConfiguration);
    }
    
    public void Configure(WebApplication app, IWebHostEnvironment env)
    {
        app
            .BootstrapOpenApi()
            .UseCors("AllowLocalReact")
            .BootstrapContentServer(builder);

        app.UseRouting();
        app.UseAuthentication()
            .UseAuthorization();
        app.BootstrapRouting()
            .UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
    
}