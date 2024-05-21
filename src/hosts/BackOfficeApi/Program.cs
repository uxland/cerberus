using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;
using Lamar.Microsoft.DependencyInjection;
using NodaTime;
using Oakton;

namespace Cerverus.BackOffice.Api;

public class Program
{
    public static Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        builder.Host.UseLamar();
        builder.Services.ConfigureHttpJsonOptions(options =>
        {
            options.SerializerOptions.TypeInfoResolverChain.Insert(0, AppJsonSerializerContext.Default);
            options.SerializerOptions.Converters.Add(new LocalDateConverter());
            options.SerializerOptions.Converters.Add(new InstantConverter());
        });
        builder.Host.ApplyOaktonExtensions();

        var startup = new Startup(builder.Configuration, builder.Environment, builder.Host);
        startup.ConfigureServices(builder.Services);
        var app = builder.Build();
        startup.Configure(app, builder.Environment);
        app.MapControllers();
        return app.RunOaktonCommands(args);
    }
}

public record Todo(int Id, string? Title, DateOnly? DueBy = null, bool IsComplete = false);

[JsonSerializable(typeof(Todo[]))]
internal partial class AppJsonSerializerContext : JsonSerializerContext
{
}

public class LocalDateConverter : JsonConverter<LocalDate>
{
    public override LocalDate Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        return LocalDate.FromDateTime(DateTime.Parse(reader.GetString()));
    }

    public override void Write(Utf8JsonWriter writer, LocalDate value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture));
    }
}

public class InstantConverter : JsonConverter<Instant>
{
    public override Instant Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var dateTime = DateTime.Parse(reader.GetString());
        return Instant.FromDateTimeUtc(dateTime.ToUniversalTime());
    }

    public override void Write(Utf8JsonWriter writer, Instant value, JsonSerializerOptions options)
    {
        var dateTime = value.ToDateTimeUtc();
        writer.WriteStringValue(dateTime.ToUniversalTime());
    }
}