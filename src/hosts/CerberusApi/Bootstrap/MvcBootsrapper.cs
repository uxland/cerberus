using System.Text.Json;
using System.Text.Json.Serialization;
using Cerberus.BackOffice;
using Cerberus.Surveillance.Features.Features.Shared.Specs;
using NodaTime.Serialization.SystemTextJson;
using SignalRClientPublisher;

namespace Cerberus.Api.Bootstrap;

internal static class MvcBootstrapper
{
    public static IServiceCollection BootstrapMvc(this IServiceCollection services)
    {
        services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                options.JsonSerializerOptions.ConfigureForNodaTime(NodaTime.DateTimeZoneProviders.Tzdb);
            })
            .AddCerberusBackOfficeFeatures()
            .AddControllersAsServices();
        return services;
    }
    
    public static WebApplication BootstrapRouting(this WebApplication app)
    {
        app.MapHub<CerberusHub>("/cerberus-hub");
        var apiGroup = app.MapGroup("/api");
        apiGroup.BootstrapSurveillanceRouting()
            .SetupBackOfficeRouting();
        return app;
    }
    public static JsonSerializerOptions BootstrapJsonSerialization(this JsonSerializerOptions options)
    {
        options.Converters.Add(new JsonStringEnumConverter());
        options.Converters.Add(new SpecJsonConverterFactory());
        options.TypeInfoResolverChain.Insert(0, JsonSerialization.TypeInfoResolver);
        return options;
    }
}