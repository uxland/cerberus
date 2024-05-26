using Cerverus.Core.Domain;
using Cerverus.Maintenance.Features.Features.Analysis;

namespace Cerverus.Maintenance.Features.Features.MaintenanceChecks;

public partial class MaintenanceCheck
: IDomainEventHandler<MaintenanceCheckCreated>
{
    public MaintenanceCheck(CreateMaintenanceCheck command)
    {
        this.Id = Guid.NewGuid().ToString();
        var (maintenanceProcessId, captureInfo, filterResults) = command;
        var nextStatus = filterResults.IsAnalysisSuccessful() ? MaintenanceCheckStatus.Completed : MaintenanceCheckStatus.RevisionPending;
        this.ApplyUncommittedEvent(new MaintenanceCheckCreated(command.MaintenanceProcessId, command.CaptureInfo, command.FilterResults, nextStatus));
    }
    

    public void Apply(MaintenanceCheckCreated @event)
    {
        this.MaintenanceProcessId = @event.MaintenanceProcessId;
        this.Status = @event.Status;
        this.CaptureInfo = @event.CaptureInfo;
        this.AnalysisResults = @event.AnalysisResults;
    }
}
