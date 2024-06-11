﻿using Cerberus.Core.Domain;
using Cerberus.Maintenance.Features.Features.MaintenanceChecks.ProduceCaptureFailureMaintenanceCheck;

namespace Cerberus.Maintenance.Features.Features.MaintenanceChecks;

public partial class MaintenanceCheck:IDomainEventHandler<FailureMaintenanceCheckCreated>
{
    public MaintenanceCheck(CreateFailureMaintenanceCheck command)
    {
        this.Id = Guid.NewGuid().ToString();
        this.ApplyUncommittedEvent(new FailureMaintenanceCheckCreated(command.MaintenanceProcessId, command.CaptureInfo, command.CaptureError, MaintenanceCheckStatus.Completed));
    }

    public void Apply(FailureMaintenanceCheckCreated @event)
    {
        this.MaintenanceProcessId = @event.MaintenanceProcessId;
        this.Status = @event.Status;
        this.CaptureError = @event.CaptureError;
        this.CaptureInfo = @event.CaptureInfo;
    }
}