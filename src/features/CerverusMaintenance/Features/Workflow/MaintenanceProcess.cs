using Cerverus.Features.Features.Captures;
using Cerverus.Maintenance.Features.Features.Analysis;
using Cerverus.Maintenance.Features.Features.Analysis.AnalyzeCapture;
using Cerverus.Maintenance.Features.Features.Issues;
using Cerverus.Maintenance.Features.Features.MaintenanceChecks;
using Cerverus.Maintenance.Features.Features.MaintenanceChecks.CommitRevision;
using Cerverus.Maintenance.Features.Features.Shared;
using Cerverus.Maintenance.Features.Features.TrainingReviews;
using Cerverus.Maintenance.Features.Features.TrainingReviews.Complete;
using Wolverine;
using Wolverine.Persistence.Sagas;

namespace Cerverus.Maintenance.Features.Features.Workflow;

public class MaintenanceProcess: Saga
{
    public required string Id { get; set; }
    
    public required Capture Capture { get; set; }

    public static (MaintenanceProcess, object?) Start(Capture capture)
    {
        var process = new MaintenanceProcess{Id = capture.Id, Capture = capture};
        if(!capture.Successful)
            return (process, new CreateFailureMaintenanceCheck(process.Id, capture.ToCaptureInfo(), capture.Error!));
        return (process, new AnalyzeCapture(process.Id, capture));
    }
    
    public async Task<object> Handle(MaintenanceAnalysisPerformed analysis, IMaintenanceSettingsProvider settingsProvider)
    {
        var (maintenanceMode, _) = await settingsProvider.GetCameraMaintenanceSettings(this.Capture.CameraId);
        var captureInfo = this.Capture.ToCaptureInfo();
        return maintenanceMode == MaintenanceMode.Training
            ? new CreateTrainingReview(this.Id!, captureInfo, analysis.FilterResults)
            : new CreateMaintenanceCheck(this.Id, captureInfo, analysis.FilterResults);

    }
    public CreateMaintenanceCheckFromTrainingReview Handle(TrainingReviewCompleted completedEvent)
    {
        return new CreateMaintenanceCheckFromTrainingReview(
            this.Id,
            this.Capture.ToCaptureInfo(),
            completedEvent.UserId,
            completedEvent.FixedResults
        );
    }
    
    public CreateIssue? Handle(MaintenanceCheckReviewed reviewedEvent)
    {
        if(reviewedEvent.HasErrors)
            return new CreateIssue(reviewedEvent.CaptureInfo, reviewedEvent.CaptureError, reviewedEvent.FilterErrors);
        this.MarkCompleted();
        return null;
    }
}

internal static class CaptureExtensions
{
    public static CaptureInfo ToCaptureInfo(this Capture capture) => new(capture.CameraId, capture.CameraPath, capture.Id, capture.SnapshotPath);
}

public interface IMaintenanceProcessMessage
{
    [SagaIdentity]string MaintenanceProcessId { get; }
}