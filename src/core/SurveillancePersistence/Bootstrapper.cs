using Cerberus.Surveillance.Features.Features.Operation;
using Cerberus.Surveillance.Features.Features.Run;
using Cerberus.Surveillance.Persistence.Projections;
using Marten;
using Marten.Events.Projections;
using Microsoft.Extensions.DependencyInjection;

namespace Cerberus.Surveillance.Persistence;

public static class Bootstrapper
{
    public static IServiceCollection BootstrapMartenSurveillancePersistence(this IServiceCollection services)
    {
        return services
            .ConfigureMarten();
    }
    
    private static IServiceCollection ConfigureMarten(this IServiceCollection services)
    {
        services.ConfigureMarten(marten => marten
            .ConfigureProjections()
        );
        return services;
    }
    
    private static StoreOptions ConfigureProjections(this StoreOptions marten)
    {
        marten.Projections.Snapshot<SurveillanceOperation>(SnapshotLifecycle.Inline);
        marten.Projections.Add<SurveillanceOperationSummaryProjection>(ProjectionLifecycle.Inline);
        
        marten.Projections.Add<SurveillanceRoundSummaryProjection>(ProjectionLifecycle.Inline);
        marten.Projections.Add<SurveillanceRoundDetailProjection>(ProjectionLifecycle.Inline);
        
        marten.Projections.Snapshot<SurveillanceRun>(SnapshotLifecycle.Inline);
        return marten;
    }
    
}