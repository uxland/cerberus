using System.Text.Json.Serialization;
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
            options.SerializerOptions.TypeInfoResolverChain.Insert(0, AppJsonSerializerContext.Default);
            options.SerializerOptions.ConfigureForNodaTime(NodaTime.DateTimeZoneProviders.Tzdb);
        });
        builder.Host.ApplyOaktonExtensions();

        var startup = new Startup(builder.Configuration, builder.Environment, builder.Host);
        startup.ConfigureServices(builder.Services);
        var app = builder.Build();
        startup.Configure(app, builder.Environment);
        app.MapControllers();
        app.MapWolverineEndpoints();
        return app.RunOaktonCommands(args);
    }
}

public record Todo(int Id, string? Title, DateOnly? DueBy = null, bool IsComplete = false);

[JsonSerializable(typeof(Todo[]))]
internal partial class AppJsonSerializerContext : JsonSerializerContext;
