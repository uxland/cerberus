using Microsoft.OpenApi.Models;

namespace Cerberus.Api.Bootstrap.OpenApi;

public static class OpenApiBootstrapper
{
    public static IServiceCollection BootstrapOpenApi(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "CerberusApi", Version = "v1" });
            c.SchemaFilter<EnumSchemaFilter>();
        });
        return services;
    }

    public static IApplicationBuilder BootstrapOpenApi(this IApplicationBuilder app)
    {
        return app.UseSwagger()
            .UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "Cerberus BackOffice API v1");
        });
    }
}