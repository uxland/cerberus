using Cerberus.Api.Bootstrap;
using JasperFx;
using NodaTime.Serialization.SystemTextJson;
using Wolverine.Http;

namespace Cerberus.Api;

public class Program
{
    public static Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Services.ConfigureHttpJsonOptions(options =>
        {
            options.SerializerOptions.BootstrapJsonSerialization()
                .ConfigureForNodaTime(NodaTime.DateTimeZoneProviders.Tzdb);
        });
        builder.Host.ApplyJasperFxExtensions();

        var startup = new Startup(builder);
        startup.SetupHttps();
        startup.ConfigureServices(builder.Services);
        var app = builder.Build();
        startup.Configure(app, builder.Environment);
        app.MapControllers();
        return app.RunJasperFxCommands(args);
    }
}



