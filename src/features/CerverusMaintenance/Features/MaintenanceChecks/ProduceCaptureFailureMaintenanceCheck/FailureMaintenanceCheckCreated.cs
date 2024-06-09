
using Cerverus.BackOffice.Features.Captures;
using Cerverus.Core.Domain;
using Cerverus.Maintenance.Features.Features.Shared;

namespace Cerverus.Maintenance.Features.Features.MaintenanceChecks;

public record FailureMaintenanceCheckCreated(string MaintenanceProcessId, CaptureInfo CaptureInfo, CaptureError CaptureError, MaintenanceCheckStatus Status) : IDomainEvent;