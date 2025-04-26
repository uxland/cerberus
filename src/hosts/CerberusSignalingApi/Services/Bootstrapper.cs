namespace Cerberus.Signaling.Api.Services;

internal static class Bootstrapper
{
    internal static IServiceCollection UseServices(this IServiceCollection services)
    {
        return services.AddSingleton<CameraConfigService>()
            .AddSingleton<StreamManager>();
    }
}