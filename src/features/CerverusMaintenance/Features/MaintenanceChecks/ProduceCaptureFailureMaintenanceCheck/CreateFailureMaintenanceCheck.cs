
using Cerverus.Core.Domain;
using Cerverus.Features.Features.Captures;
using Cerverus.Maintenance.Features.Features.Shared;
using Cerverus.Maintenance.Features.Features.Workflow;

namespace Cerverus.Maintenance.Features.Features.MaintenanceChecks;

public record CreateFailureMaintenanceCheck(
    string MaintenanceProcessId,
    CaptureInfo CaptureInfo,
    CaptureError CaptureError) : ICommand, IMaintenanceProcessMessage; 