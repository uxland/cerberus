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
        return app.BootstrapSurveillanceRouting();
    }
    public static JsonSerializerOptions BootstrapJsonSerialization(this JsonSerializerOptions options)
    {
        var context = new DefaultJsonTypeInfoResolver();
        context.UseSurveillanceSerialization();
        options.TypeInfoResolverChain.Insert(0, context);
        return options;
    }
}