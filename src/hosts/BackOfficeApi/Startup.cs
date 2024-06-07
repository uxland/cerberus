using Cerverus.BackOffice.Api.Bootstrap;
using Cerverus.BackOffice.Api.Setup;
using Cerverus.Core.MartenPersistence;
using Cerverus.Core.XabeFFMpegClient;
using Cerverus.Features;
using Microsoft.OpenApi.Models;

namespace Cerverus.BackOffice.Api;

public class Startup(IConfiguration configuration, IHostEnvironment hosting, ConfigureHostBuilder hostBuilder)
{
    public void ConfigureServices(IServiceCollection services)
    {
        
         services.AddControllers()
            .AddCerverusBackOfficeFeatures()
            .AddControllersAsServices();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "BackOfficeApi", Version = "v1" });
        });

        hostBuilder.SetupWolverine();
        
        services.AddCors(options =>
        {
            options.AddPolicy("AllowSpecificOrigin",
                builder =>
                {
                    builder.WithOrigins("http://localhost:5177", "https://localhost:7005")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                });
        });
        services
            .SetupConfigurations(configuration)
            .UseLogging()
            .BootstrapXabeFFMpegClient()
            .UseMartenPersistence(configuration, hosting)
            .BootstrapBackOffice()
            .BootstrapMaintenance();
    }
    
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "Cerverus BackOffice API v1");
        });
        app.UseRouting();
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
    
}