using Cerberus.BackOffice.Features.Captures;
using Cerberus.BackOffice.Features.OrganizationalStructure.Camera;
using Cerberus.BackOffice.Features.OrganizationalStructure.HierarchyItems;
using Cerberus.BackOffice.Features.OrganizationalStructure.Shared;
using Cerberus.BackOffice.Features.Shared;
using Cerberus.MvcUtilities;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Wolverine.Attributes;

[assembly: WolverineModule]

namespace Cerberus.BackOffice;


public static class DependencyInjection
{
    public static IServiceCollection UseCerberusBackOfficeFeatures(this IServiceCollection services, IConfiguration configuration)
    {
        System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
        return services
            .UseSharedOrganizationStructure()
            .UseCaptureFeatures(configuration)
            .SetUpAuthorization();
        
        
    }
    
    
    private static IServiceCollection SetUpAuthorization(this IServiceCollection services)
    {
        return services.AddAuthorization(options =>
        {
            options.AddPolicy(BackOfficePolicies.User, policy => policy.RequireClaim("roles", BackOfficeRoles.BackofficeAdmin));
        });
    }
    
    public static IMvcBuilder AddCerberusBackOfficeFeatures(this IMvcBuilder builder)
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


