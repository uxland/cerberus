using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;
using NodaTime;

namespace Cerverus.BackOffice.Api;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateSlimBuilder(args);

        builder.Services.ConfigureHttpJsonOptions(options =>
        {
            options.SerializerOptions.TypeInfoResolverChain.Insert(0, AppJsonSerializerContext.Default);
            options.SerializerOptions.Converters.Add(new LocalDateConverter());
            options.SerializerOptions.Converters.Add(new InstantConverter());
        });

        var startup = new Startup(builder.Configuration, builder.Environment);
        startup.ConfigureServices(builder.Services);
        var app = builder.Build();
        startup.Configure(app, builder.Environment);
        app.MapControllers();
        app.Run();
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