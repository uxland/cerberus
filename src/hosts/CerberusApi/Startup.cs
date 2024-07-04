using Cerberus.Api.Bootstrap;
using Cerberus.Api.Bootstrap.OpenApi;
using Cerberus.Api.Setup;
using Cerberus.BackOffice;
using Cerberus.Core.MartenPersistence;
using Cerberus.Core.XabeFFMpegClient;
using Microsoft.OpenApi.Models;

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
        services.BootstrapMvc()
            .BootstrapOpenApi();
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
            .UseMartenPersistence(builder.Configuration, builder.Environment);
        services
            .BootstrapBackOffice(builder.Configuration, martenConfiguration)
            .BootstrapMaintenance(martenConfiguration);
    }
    
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app
            .BootstrapOpenApi()
            .UseCors("AllowLocalReact")
            .BootstrapContentServer(builder);

        app.UseRouting();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
    
}