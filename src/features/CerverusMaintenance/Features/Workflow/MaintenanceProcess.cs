using Cerverus.BackOffice.Features.Captures;
using Cerverus.Maintenance.Features.Features.Analysis;
using Cerverus.Maintenance.Features.Features.Analysis.AnalyzeCapture;
using Cerverus.Maintenance.Features.Features.Issues;
using Cerverus.Maintenance.Features.Features.MaintenanceChecks;
using Cerverus.Maintenance.Features.Features.MaintenanceChecks.CommitRevision;
using Cerverus.Maintenance.Features.Features.Shared;
using Cerverus.Maintenance.Features.Features.TrainingReviews;
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
            return (process, CreateIssue.FromCaptureError(process.Id, capture.ToCaptureInfo(), capture.Error!));
        return (process, new AnalyzeCapture(process.Id, capture));
    }
    
    public async Task<object?> Handle(MaintenanceAnalysisPerformed analysis, IMaintenanceSettingsProvider settingsProvider)
    {
        var (maintenanceMode, _) = await settingsProvider.GetCameraMaintenanceSettings(this.Capture.CameraId);
        var captureInfo = this.Capture.ToCaptureInfo();
        if(maintenanceMode == MaintenanceMode.Training)
            return new CreateTrainingReview(this.Id!, captureInfo, analysis.FilterResults);
        if(!analysis.FilterResults.IsAnalysisSuccessful())
            return new CreateMaintenanceCheck(this.Id, captureInfo, analysis.FilterResults);
        this.MarkCompleted();
        return null;
    }
    public CreateIssue? Handle(TrainingReviewEnded reviewEnded)
    {
        if(reviewEnded.Failures.Count != 0)
            return CreateIssue.FromAnalysisFailure(this.Id, this.Capture.ToCaptureInfo(), reviewEnded.FilterResults, reviewEnded.ReviewedBy);
        this.MarkCompleted();
        return null;
    }
    
    public CreateIssue? Handle(MaintenanceCheckReviewed reviewedEvent)
    {
        if(reviewedEvent.HasErrors)
            return new CreateIssue(reviewedEvent.MaintenanceProcessId, reviewedEvent.CaptureInfo, reviewedEvent.CaptureError, reviewedEvent.FilterErrors, reviewedEvent.ReviewerUser);
        this.MarkCompleted();
        return null;
    }
    
    public void Handle(MaintenanceIssueRevolved _)
    {
        this.MarkCompleted();
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