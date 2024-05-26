using Cerverus.BackOffice.Persistence.Projections;
using Cerverus.BackOffice.Persistence.QueryProviders;
using Cerverus.BackOffice.Persistence.Repositories;
using Cerverus.Core.Domain;
using Cerverus.Core.MartenPersistence;
using Cerverus.Features.Features.Captures;
using Cerverus.Features.Features.OrganizationalStructure.Camera;
using Cerverus.Features.Features.OrganizationalStructure.HierarchyItems;
using Cerverus.Features.Features.OrganizationalStructure.Location;
using Marten;
using Marten.Events.Projections;
using Microsoft.Extensions.DependencyInjection;

namespace Cerverus.BackOffice.Persistence;

public static class DependencyInjection
{
    public static IServiceCollection AddMartenBackOfficePersistence(this IServiceCollection services)
    {
        return services
                .UseRepositories()
                .UseQueryProviders()
                .ConfigureMarten();
    }
    private static IServiceCollection ConfigureMarten(this IServiceCollection services)
    {
        services.ConfigureMarten(marten => marten
            .ConfigureProjections()
            .SetupIndexes());
        return services;
    }
    
    private static StoreOptions ConfigureProjections(this StoreOptions options)
    {
        options.Projections.Snapshot<Location>(SnapshotLifecycle.Inline);
        options.Projections.Snapshot<Camera>(SnapshotLifecycle.Inline);
        options.Projections.Snapshot<Capture>(SnapshotLifecycle.Inline);
        options.Projections.Add<HierarchyItemProjection>(ProjectionLifecycle.Inline);
        return options;
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
    private static IServiceCollection UseRepositories(this IServiceCollection services)
    {
        return services
            .AddScoped<IRepository<Location>, LocationRepository>()
            .AddScoped<IRepository<Camera>, CameraRepository>()
            .AddScoped<IRepository<Capture>, CaptureRepository>();
    }
    
    private static IServiceCollection UseQueryProviders(this IServiceCollection services)
    {
        return services
            .AddTransient<ICameraQueryProvider, CameraQueryProvider>()
            .AddTransient<IHierarchyItemQueryProvider, HierarchyItemQueryProviders>()
            .AddTransient<IQueryProvider<Location>, LocationQueryProvider>()
            .AddTransient<ICaptureQueryProvider, CaptureQueryProvider>();
    }
}