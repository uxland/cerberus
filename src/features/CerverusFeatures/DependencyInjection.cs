using Cerverus.Features.Features.Captures;
using Cerverus.Features.Features.OrganizationalStructure.Shared;
using Microsoft.Extensions.DependencyInjection;
using Wolverine.Attributes;

[assembly: WolverineModule]

namespace Cerverus.Features;


public static class DependencyInjection
{
    public static IServiceCollection UseCerverusBackOfficeFeatures(this IServiceCollection services)
    {
        System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
        return services
            .UseSharedOrganizationStructure()
            .UseCaptureFeatures();
    }
    
    public static IMvcBuilder AddCerverusBackOfficeFeatures(this IMvcBuilder builder)
    {
        return builder.AddApplicationPart(typeof(DependencyInjection).Assembly);
    }
    
}