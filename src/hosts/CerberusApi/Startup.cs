using Cerberus.Api.Bootstrap;
using Cerberus.Api.Setup;
using Cerberus.BackOffice;
using Cerberus.Core.MartenPersistence;
using Cerberus.Core.XabeFFMpegClient;
using Microsoft.OpenApi.Models;

namespace Cerberus.Api;

public class Startup(IConfiguration configuration, IHostEnvironment hosting, ConfigureHostBuilder hostBuilder)
{
    public void ConfigureServices(IServiceCollection services)
    {
        
         services.AddControllers()
            .AddCerberusBackOfficeFeatures()
            .AddControllersAsServices();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "CerberusApi", Version = "v1" });
        });
        services.AddCors(options =>
        {
            options.AddPolicy("AllowLocalReact",
                builder =>
                {
                    builder
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                    builder.SetIsOriginAllowed(s => new Uri(s).Host == "localhost");
                });

            options.AddPolicy("Allow local Blazor",
                builder =>
                {
                    builder.WithOrigins("http://localhost:5177", "https://localhost:7005")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
        });

        hostBuilder.SetupWolverine();
        
        var martenConfiguration = services
            .SetupConfigurations(configuration)
            .UseLogging()
            .BootstrapXabeFFMpegClient()
            .UseMartenPersistence(configuration, hosting);
        services
            .BootstrapBackOffice(configuration, martenConfiguration)
            .BootstrapMaintenance(martenConfiguration);
    }
    
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "Cerberus BackOffice API v1");
        });

        // Use the policy that allows any port on localhost
        app.UseCors("AllowLocalReact");
      //  app.UseCors("Allow local Blazor");

        app.UseRouting();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
    
}