using System.Linq.Expressions;
using Cerberus.Maintenance.Features.Features.Analysis.Filters;
using Cerberus.Maintenance.Features.Features.Issues;
using Cerberus.Maintenance.Features.Features.Issues.GetDetail;
using Cerberus.Maintenance.Features.Features.Issues.ListByLocationPath;
using Cerberus.Maintenance.Features.Features.MaintenanceChecks;
using Cerberus.Maintenance.Features.Features.Settings;
using Cerberus.Maintenance.Features.Features.Settings.GetMaintenanceSettings;
using Cerberus.Maintenance.Features.Features.TrainingReviews;
using Cerberus.Maintenance.Features.Features.TrainingReviews.ListPendingReviewByLocation;
using Cerberus.Maintenance.Persistence.Projections;
using Cerberus.Maintenance.Persistence.QueryProviders;
using Cerberus.Maintenance.Persistence.Seeding;
using JasperFx.Events.Projections;
using Marten;
using Marten.Events.Projections;
using Microsoft.Extensions.DependencyInjection;

namespace Cerberus.Maintenance.Persistence;

public static class Bootstrapper
{
    public static IServiceCollection BootstrapMartenMaintenancePersistence(this IServiceCollection services)
    {
        return services
            .ConfigureMarten()
            .BootstrapQueryProviders();
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
        marten.Projections.Snapshot<CameraMaintenanceSettings>(SnapshotLifecycle.Inline);
        
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