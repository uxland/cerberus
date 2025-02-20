using System.Text.Json.Serialization;
using Cerberus.BackOffice;

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
}