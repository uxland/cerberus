using Cerberus.Core.Domain;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
namespace SignalRClientPublisher;

public static class Bootstrapper
{
    public static IServiceCollection UseSignalRClientPublisher(this IServiceCollection services)
    {
        return services.AddSingleton<IClientPublisher, SignalRPublisher>();
    }
}