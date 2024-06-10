using Cerberus.BackOffice.Features.Captures;
using Cerberus.Core.Domain;
using Cerberus.Maintenance.Features.Features.Shared;

namespace Cerberus.Maintenance.Features.Features.MaintenanceChecks.ProduceCaptureFailureMaintenanceCheck;

public record FailureMaintenanceCheckCreated(string MaintenanceProcessId, CaptureInfo CaptureInfo, CaptureError CaptureError, MaintenanceCheckStatus Status) : IDomainEvent;