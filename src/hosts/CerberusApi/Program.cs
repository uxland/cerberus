using System.Text.Json.Serialization;
using System.Text.Json.Serialization.Metadata;
using Cerberus.Api.Bootstrap;
using Cerberus.Surveillance.Features;
using Lamar.Microsoft.DependencyInjection;
using NodaTime.Serialization.SystemTextJson;
using Oakton;
using Wolverine.Http;

namespace Cerberus.Api;

public class Program
{
    public static Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Host.UseLamar();
        builder.Services.ConfigureHttpJsonOptions(options =>
        {
            options.SerializerOptions.BootstrapJsonSerialization()
                .ConfigureForNodaTime(NodaTime.DateTimeZoneProviders.Tzdb);
        });
        builder.Host.ApplyOaktonExtensions();

        var startup = new Startup(builder);
        startup.ConfigureServices(builder.Services);
        var app = builder.Build();
        startup.Configure(app, builder.Environment);
        app.MapControllers();
        app.MapWolverineEndpoints();
        return app.RunOaktonCommands(args);
    }
}



