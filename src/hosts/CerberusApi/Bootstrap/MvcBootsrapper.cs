using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.Json.Serialization.Metadata;
using Cerberus.BackOffice;
using Cerberus.Surveillance.Features;

namespace Cerberus.Api.Bootstrap;

internal static class MvcBootstrapper
{
    public static IServiceCollection BootstrapMvc(this IServiceCollection services)
    {
        services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            })
            .AddCerberusBackOfficeFeatures()
            .AddControllersAsServices();
        return services;
    }
    
    public static WebApplication BootstrapRouting(this WebApplication app)
    {
        var apiGroup = app.MapGroup("/api");
        apiGroup.BootstrapSurveillanceRouting()
            .SetupBackOfficeRouting();
        return app;
    }
    public static JsonSerializerOptions BootstrapJsonSerialization(this JsonSerializerOptions options)
    {
        options.TypeInfoResolverChain.Insert(0, JsonSerialization.TypeInfoResolver);
        return options;
    }
}