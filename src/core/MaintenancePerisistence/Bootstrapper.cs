using Cerverus.Core.Domain;
using Cerverus.Maintenance.Features.Features.Issues;
using Cerverus.Maintenance.Features.Features.Issues.GetDetail;
using Cerverus.Maintenance.Features.Features.Issues.ListByLocationPath;
using Cerverus.Maintenance.Features.Features.MaintenanceChecks;
using Cerverus.Maintenance.Features.Features.TrainingReviews;
using Cerverus.Maintenance.Features.Features.TrainingReviews.GetPendingReviews;
using Cerverus.Maintenance.Persistence.Projections;
using Cerverus.Maintenance.Persistence.QueryProviders;
using Cerverus.Maintenance.Persistence.Repositories;
using Marten;
using Marten.Events.Projections;
using Microsoft.Extensions.DependencyInjection;

namespace Cerverus.Maintenance.Persistence;

public static class Bootstrapper
{
    public static IServiceCollection BootstrapMartenMaintenancePersistence(this IServiceCollection services)
    {
        return services
            .ConfigureMarten()
            .BootstrapRepositories()
            .BootstrapQueryProviders();
    }
    
    private static IServiceCollection BootstrapRepositories(this IServiceCollection services)
    {
        return services
            .AddScoped<IRepository<MaintenanceCheck>, MaintenanceCheckRepository>()
            .AddScoped<IRepository<TrainingReview>, TrainingReviewRepository>()
            .AddScoped<IRepository<MaintenanceIssue>, MaintenanceIssueRepository>();
    }
    
    private static IServiceCollection BootstrapQueryProviders(this IServiceCollection services)
    {
        return services
            .AddScoped<IPendingTrainingReviewQueryProvider, PendingTrainingReviewQueryProvider>()
            .AddScoped<IMaintenanceSettingsProvider, MaintenanceSettingsProvider>()
            .AddScoped<IMaintenanceIssueQueryProvider, IssueDetailQueryProvider>()
            .AddScoped<IMaintenanceIssueSummaryQueryProvider, MaintenanceIssueSummaryQueryProvider>();
    }

    private static IServiceCollection ConfigureMarten(this IServiceCollection services)
    {
        services.ConfigureMarten(marten => marten
            .ConfigureProjections()
            .SetupIndexes());
        return services;
    }
    private static StoreOptions ConfigureProjections(this StoreOptions marten)
    {
        marten.Projections.Snapshot<TrainingReview>(SnapshotLifecycle.Inline);
        marten.Projections.Snapshot<MaintenanceCheck>(SnapshotLifecycle.Inline);
        marten.Projections.Snapshot<MaintenanceIssue>(SnapshotLifecycle.Inline);
        marten.Projections.Add<PendingTrainingReviewProjection>(ProjectionLifecycle.Inline);
        marten.Projections.Add<IssueDetailProjection>(ProjectionLifecycle.Async);
        marten.Projections.Add<IssueSummaryProjection>(ProjectionLifecycle.Async);
        
        return marten;
    }
    
    private static StoreOptions SetupIndexes(this StoreOptions options)
    {
        options.Schema.For<PendingTrainingReview>().Index(x => x.CameraPath);
        options.Schema.For<MaintenanceCheck>()
            .Index(x => x.CaptureInfo.CameraPath)
            .Index(x => x.CaptureInfo.CaptureId)
            .Index(x => x.CaptureInfo.CameraId);
        options.Schema.For<TrainingReview>()
            .Index(x => x.CaptureInfo.CameraPath)
            .Index(x => x.CaptureInfo.CaptureId)
            .Index(x => x.CaptureInfo.CameraId);
        options.Schema.For<MaintenanceIssueSummary>()
            .Index(x => x.Path);
        
        
        return options;
    }
}