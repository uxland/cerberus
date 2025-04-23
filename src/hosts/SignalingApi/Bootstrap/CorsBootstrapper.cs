namespace Cerberus.Signaling.Api.Bootstrap;

internal static class CorsBootstrapper
{
    private static string[] CORS_ALLOWED_HOSTS =
    [
        "localhost",
        "cerberus-ui",
        "cerberus-react-ui"
    ];
    internal static IServiceCollection UseCors(this IServiceCollection services)
    {
        return services.AddCors(options =>
        {
            options.AddPolicy("AllowLocalReact",
                builder =>
                {
                    builder
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                    builder.SetIsOriginAllowed(s =>
                    {
                        var uri = new Uri(s);
                        return CORS_ALLOWED_HOSTS.Contains(uri.Host);
                    });
                });
            
        });
    }
}