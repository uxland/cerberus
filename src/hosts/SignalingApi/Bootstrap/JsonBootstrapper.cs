
using System.Text.Json.Serialization;
using NodaTime.Serialization.SystemTextJson;

namespace Cerberus.Signaling.Api.Bootstrap;

public static class JsonBootstrapper
{
    public static IServiceCollection BootstrapJsonSerialization(this IServiceCollection services)
    {
        services.ConfigureHttpJsonOptions(options =>
        {
            options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
            options.SerializerOptions.ConfigureForNodaTime(NodaTime.DateTimeZoneProviders.Tzdb);
        });

        return services;
        
    }
}