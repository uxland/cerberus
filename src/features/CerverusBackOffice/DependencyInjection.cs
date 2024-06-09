using Cerverus.BackOffice.Features.Captures;
using Cerverus.BackOffice.Features.OrganizationalStructure.Camera;
using Cerverus.BackOffice.Features.OrganizationalStructure.HierarchyItems;
using Cerverus.BackOffice.Features.OrganizationalStructure.Shared;
using Cerverus.MvcUtilities;
using Microsoft.Extensions.DependencyInjection;
using Wolverine.Attributes;

[assembly: WolverineModule]

namespace Cerverus.BackOffice;


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
        builder.AddMvcOptions(options =>
            {
                options.OutputFormatters.Add(new OutputFormatter<Camera>(Features.OrganizationalStructure.Camera.GetCameraDetail.CamerasController.ProducesMediaType));
                options.OutputFormatters.Add(new OutputFormatter<IEnumerable<HierarchyItem>>(Features.OrganizationalStructure.HierarchyItems.GetAll.LocationsController.ProducesMediaType));
            }
        );
        return builder.AddApplicationPart(typeof(DependencyInjection).Assembly);
    }
}


