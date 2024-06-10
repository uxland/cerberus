using Cerberus.Maintenance.Features.Features.MaintenanceChecks.CommitRevision;
using Cerberus.Maintenance.Features.Features.MaintenanceChecks.ProduceFromTrainingReview;
using NodaTime;

namespace Cerberus.Maintenance.Features.Features.MaintenanceChecks;

public partial class MaintenanceCheck
{
    public MaintenanceCheck(CreateMaintenanceCheckFromTrainingReview command)
    {
        this.ApplyUncommittedEvent(new MaintenanceCheckCreated(
            command.MaintenanceProcessId,
            command.CaptureInfo,
            command.AnalysisResults,
            MaintenanceCheckStatus.Completed
        ));
        this.ApplyUncommittedEvent(new MaintenanceCheckReviewed(this.MaintenanceProcessId!, this.CaptureInfo!, command.AnalysisResults, this.CaptureError, command.ReviewerUser, SystemClock.Instance.GetCurrentInstant()));
    }
}