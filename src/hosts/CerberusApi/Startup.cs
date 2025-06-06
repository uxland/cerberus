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
        "cerberus-react-ui",
        "cerberus-ui.local",
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

    public void SetupHttps()
    {
        var settings = HttpsSettings.Parse(builder.Configuration);

        Console.WriteLine($"[HTTPS] Path: {settings.CertificatePath}");
        Console.WriteLine($"[HTTPS] Password is {(string.IsNullOrEmpty(settings.CertificatePassword) ? "not set" : "set")}");

        if (string.IsNullOrEmpty(settings.CertificatePassword))
        {
            Console.WriteLine("[HTTPS] Skipping HTTPS setup because password is missing.");
            return;
        }

        builder.WebHost.ConfigureKestrel(options =>
        {
            options.ListenAnyIP(443, listenOptions =>
            {
                Console.WriteLine($"[HTTPS] Binding to port 443 with cert: {settings.CertificatePath}");
                listenOptions.UseHttps(settings.CertificatePath ?? "/https/cert.pfx", settings.CertificatePassword);
            });
        });
    }


    private record HttpsSettings(
        string? CertificatePath,
        string? CertificatePassword
    )
    {
        public static HttpsSettings Parse(IConfiguration configuration)
        {
            var path = configuration.GetSection("Https:CertificatePath").Value;
            var password = configuration.GetSection("Https:CertificatePassword").Value;
           return new HttpsSettings(path, password);
        }
    }
}