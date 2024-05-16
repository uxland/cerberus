using Cerverus.BackOffice.Persistence.Projections;
using Cerverus.BackOffice.Persistence.QueryProviders;
using Cerverus.BackOffice.Persistence.Repositories;
using Cerverus.Core.Domain;
using Cerverus.Core.MartenPersistence;
using Cerverus.Features.Features.Captures;
using Cerverus.Features.Features.Captures.GetCameraThumbnails;
using Cerverus.Features.Features.OrganizationalStructure.Camera;
using Cerverus.Features.Features.OrganizationalStructure.HierarchyItems;
using Cerverus.Features.Features.OrganizationalStructure.Location;
using Marten;
using Marten.Events.Projections;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Cerverus.BackOffice.Persistence;

public static class DependencyInjection
{
    public static IServiceCollection AddMartenBackOfficePersistence(this IServiceCollection services,
        IConfiguration configuration, IHostEnvironment environment)
    {
        return
            services.UseMartenPersistence(configuration, environment, options => ConfigureMarten(options, services))
                .UseRepositories()
                .UseQueryProviders();
    }
    private static void ConfigureMarten(this StoreOptions storeOptions, IServiceCollection services)
    {
        storeOptions
            .ConfigureEventSore()
            .ConfigureProjections(services.BuildServiceProvider().GetRequiredService<IPublisher>())
            .SetupIndexes();
    }

    private static StoreOptions ConfigureEventSore(this StoreOptions options)
    {
        options.Events.DatabaseSchemaName = "back_office_events";
        options.DatabaseSchemaName = "back_office_read_model";
        
        return options;
    }
    private static StoreOptions ConfigureProjections(this StoreOptions options, IPublisher publisher)
    {
        options.Projections.Snapshot<Location>(SnapshotLifecycle.Inline);
        options.Projections.Snapshot<Camera>(SnapshotLifecycle.Inline);
        options.Projections.Snapshot<Capture>(SnapshotLifecycle.Inline);
        options.Projections.Add<HierarchyItemProjection>(ProjectionLifecycle.Inline);
      //  options.Projections.Add<CameraThumbnailsProjection>(ProjectionLifecycle.Async);
        return options;
    }
    
    private static StoreOptions SetupIndexes(this StoreOptions options)
    {
        options.Schema.For<Location>().Index(x => x.Description);
        options.Schema.For<Camera>()
            .Index(x => x.Description)
            .Index(x => x.Path);
        options.Schema.For<Capture>()
            .Index(x => x.CameraId);
        return options;
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