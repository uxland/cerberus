using Cerverus.Features.Features.Captures;
using Cerverus.Features.Features.OrganizationalStructure.Shared;
using Microsoft.Extensions.DependencyInjection;

namespace Cerverus.Features;

public static class DependencyInjection
{
    public static IServiceCollection UseCerverusBackOfficeFeatures(this IServiceCollection services)
    {
        System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
        services.AddMediatR(op => op.RegisterServicesFromAssemblies(typeof(DependencyInjection).Assembly));
        
        return services
            .UseSharedOrganizationStructure()
            .UseCaptureFeatures();
    }
    
    public static IMvcBuilder AddCerverusBackOfficeFeatures(this IMvcBuilder builder)
    {
        return builder.AddApplicationPart(typeof(DependencyInjection).Assembly);
    }
    
}