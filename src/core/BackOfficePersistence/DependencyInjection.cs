using Cerverus.BackOffice.Persistence.Projections;
using Cerverus.BackOffice.Persistence.Repositories;
using Cerverus.Core.Domain;
using Cerverus.Core.MartenPersistence;
using Cerverus.Features.Features.OrganizationalStructure.Camera;
using Cerverus.Features.Features.OrganizationalStructure.Location;
using Cerverus.Features.Features.OrganizationalStructure.ReadModels;
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
                .UseRepositories();
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
        options.Projections.Add<HierarchyItemProjection>(ProjectionLifecycle.Async);
        return options;
    }
    
    private static StoreOptions SetupIndexes(this StoreOptions options)
    {
        options.Schema.For<Location>().Index(x => x.Description);
        options.Schema.For<Camera>().Index(x => x.Description);
        return options;
    }
    private static IServiceCollection UseRepositories(this IServiceCollection services)
    {
        return services
            .AddScoped<IRepository<Location>, LocationRepository>()
            .AddScoped<IRepository<Camera>, CameraRepository>();
    }
}