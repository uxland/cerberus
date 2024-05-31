using Cerverus.Maintenance.Features.Features.MaintenanceChecks.CommitRevision;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.MaintenanceChecks;

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
        this.ApplyUncommittedEvent(new MaintenanceCheckReviewed(this.MaintenanceProcessId!, this.CaptureInfo!, command.AnalysisResults, this.CaptureError, command.ReviewerUser, SystemClock.Instance.GetCurrentInstant().InUtc()));
    }
}