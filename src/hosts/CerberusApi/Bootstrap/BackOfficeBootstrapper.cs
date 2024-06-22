using Cerberus.BackOffice;
using Cerberus.BackOffice.Persistence;
using Marten;

namespace Cerberus.Api.Bootstrap;

public static class BackOfficeBootstrapper
{
    public static IServiceCollection BootstrapBackOffice(this IServiceCollection services, IConfiguration configuration,
        MartenServiceCollectionExtensions.MartenConfigurationExpression martenConfiguration)
    {
        
        return services
            .AddMartenBackOfficePersistence(martenConfiguration)
            .UseCerberusBackOfficeFeatures(configuration);
    }
}