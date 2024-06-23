using Cerberus.Core.XabeFFMpegClient.CaptureMiddlewares;
using Microsoft.Extensions.DependencyInjection;

namespace Cerberus.Core.XabeFFMpegClient.ConversionBuilders;

public static class Bootstrapper
{
    public static IServiceCollection BootstrapCaptureMiddlewares(this IServiceCollection services)
    {
        return services
            .AddTransient<IConversionBuilderStep, DurationBuilder>()
            .AddTransient<IConversionBuilderStep, FileBuilder>()
            .AddTransient<IConversionBuilderStep, RstpBuilder>()
            .AddTransient<IConversionBuilderStep, MonochromeBuilder>()
            .AddTransient<ConversionBuilder>();
    }
}