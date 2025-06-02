using Cerberus.Core.XabeFFMpegClient.CaptureMiddlewares;
using Microsoft.Extensions.DependencyInjection;
using Xabe.FFmpeg;

namespace Cerberus.Core.XabeFFMpegClient.ConversionBuilders;

public static class Bootstrapper
{
    public static IServiceCollection BootstrapCaptureMiddlewares(this IServiceCollection services)
    {
        return services
            .AddTransient<IConversionBuilderStep, OverwriteBuilder>()
            .AddTransient<IConversionBuilderStep, RstpBuilder>()
            .AddTransient<IConversionBuilderStep, InputBuilder>()
            .AddTransient<IConversionBuilderStep, DurationBuilder>()
            .AddTransient<IConversionBuilderStep, FileBuilder>()
            .AddTransient<IConversionBuilderStep, MonochromeBuilder>()
            .AddTransient<ConversionBuilder>();
    }
}