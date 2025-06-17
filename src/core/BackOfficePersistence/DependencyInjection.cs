using Cerberus.BackOffice.Features.Captures;
using Cerberus.BackOffice.Features.Captures.Triggers;
using Cerberus.BackOffice.Features.OrganizationalStructure.Camera;
using Cerberus.BackOffice.Features.OrganizationalStructure.Camera.SetupCamera;
using Cerberus.BackOffice.Features.OrganizationalStructure.HierarchyItems;
using Cerberus.BackOffice.Features.OrganizationalStructure.Location;
using Cerberus.BackOffice.Persistence.Projections;
using Cerberus.BackOffice.Persistence.QueryProviders;
using Cerberus.BackOffice.Persistence.Subscriptions;
using Cerberus.Core.Domain;
using JasperFx;
using JasperFx.Events.Projections;
using Marten;
using Marten.Events.Projections;
using Microsoft.Extensions.DependencyInjection;

namespace Cerberus.BackOffice.Persistence;

public static class DependencyInjection
{
    public static IServiceCollection AddMartenBackOfficePersistence(this IServiceCollection services,
        MartenServiceCollectionExtensions.MartenConfigurationExpression martenConfiguration)
    {
        martenConfiguration.ConfigureSubscriptions();
        return services
                .UseQueryProviders()
                .ConfigureMarten();
    }
    private static IServiceCollection ConfigureMarten(this IServiceCollection services)
    {
        return services
            .ConfigureMarten(marten => marten
                .ConfigureProjections()
                .SetupIndexes()
            )
            ;
    }
    
    private static StoreOptions ConfigureProjections(this StoreOptions options)
    {
        options.Projections.Snapshot<Location>(SnapshotLifecycle.Inline);
        options.Projections.Snapshot<Camera>(SnapshotLifecycle.Inline);
        options.Projections.Snapshot<Capture>(SnapshotLifecycle.Inline);
        options.Projections.Snapshot<CaptureTrigger>(SnapshotLifecycle.Inline);
        options.Projections.Add<HierarchyItemProjection>(ProjectionLifecycle.Inline);
        return options;
    }
    
    private static void ConfigureSubscriptions(
        this MartenServiceCollectionExtensions.MartenConfigurationExpression options)
    {
        /*options.AddSubscriptionWithServices<CameraRecurrencePatternSubscription>(ServiceLifetime.Singleton, o =>
        {
            o.Options.BatchSize = 100;
            o.IncludeType<CameraCreated>();
            o.IncludeType<CameraRecurrencePatternChanged>();
        });*/
        options.AddSubscriptionWithServices<CameraSettingsSubscription>(ServiceLifetime.Singleton, o =>
        {
            o.Options.BatchSize = 100;
            o.IncludeType<CameraCreated>();
            o.IncludeType<CameraUpdated>();
        });
    }
    
    private static void SetupIndexes(this StoreOptions options)
    {
        options.Schema.For<Location>().Index(x => x.Description);
        options.Schema.For<Camera>()
            .Index(x => x.Description)
            .Index(x => x.Path);
        options.Schema.For<Capture>()
            .Index(x => x.CameraId);
    }
    
    private static IServiceCollection UseQueryProviders(this IServiceCollection services)
    {
        return services
            .AddTransient<ICameraEntityQueryProvider, CameraEntityQueryProvider>()
            .AddTransient<IHierarchyItemEntityQueryProvider, HierarchyItemEntityQueryProviders>()
            .AddTransient<IEntityQueryProvider<Location>, LocationEntityQueryProvider>()
            .AddTransient<ICaptureQueryProvider, CaptureEntityQueryProvider>();
    }
}