using System.Linq.Expressions;
using Cerverus.Core.Domain;
using Cerverus.Maintenance.Features.Features.Analysis.Filters;
using Cerverus.Maintenance.Features.Features.Issues;
using Cerverus.Maintenance.Features.Features.Issues.GetDetail;
using Cerverus.Maintenance.Features.Features.Issues.ListByLocationPath;
using Cerverus.Maintenance.Features.Features.MaintenanceChecks;
using Cerverus.Maintenance.Features.Features.TrainingReviews;
using Cerverus.Maintenance.Features.Features.TrainingReviews.GetPendingReviews;
using Cerverus.Maintenance.Persistence.Projections;
using Cerverus.Maintenance.Persistence.QueryProviders;
using Cerverus.Maintenance.Persistence.Repositories;
using Cerverus.Maintenance.Persistence.Seeding;
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
            .AddScoped<IMaintenanceSettingsProvider, MaintenanceSettingsProvider>()
            .AddScoped<IMaintenanceIssueEntityQueryProvider, IssueDetailEntityQueryProvider>();
    }

    private static IServiceCollection ConfigureMarten(this IServiceCollection services)
    {
        services.ConfigureMarten(marten => marten
            .ConfigureProjections()
            .SetupIndexes()
        ).InitializeMartenWith<ScriptsInitialData>();
        return services;
    }
    private static StoreOptions ConfigureProjections(this StoreOptions marten)
    {
        marten.Projections.Snapshot<TrainingReview>(SnapshotLifecycle.Inline);
        marten.Projections.Snapshot<MaintenanceCheck>(SnapshotLifecycle.Inline);
        marten.Projections.Snapshot<MaintenanceIssue>(SnapshotLifecycle.Inline);
        marten.Projections.Snapshot<Filter>(SnapshotLifecycle.Inline);
        marten.Projections.Add<PendingTrainingReviewProjection>(ProjectionLifecycle.Async);
        marten.Projections.Add<TrainingReviewDetailProjection>(ProjectionLifecycle.Async);
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
        var maintenanceIssueIndex = new Expression<Func<PendingMaintenanceIssueSummary, object>>[]
        {
            x => x.Path,
            x => x.CreatedAt,
        };
        options.Schema.For<PendingMaintenanceIssueSummary>()
            .Index(x => maintenanceIssueIndex, index => index.Name = "idx_pending_maintenance_issue_path_created_at");
        
        
        return options;
    }
}