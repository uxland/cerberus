using Cerberus.BackOffice.Features.Captures;
using Cerberus.Core.Domain;
using Cerberus.Maintenance.Features.Features.Shared;
using Cerberus.Maintenance.Features.Features.Workflow;

namespace Cerberus.Maintenance.Features.Features.MaintenanceChecks.ProduceCaptureFailureMaintenanceCheck;

public record CreateFailureMaintenanceCheck(
    string MaintenanceProcessId,
    CaptureInfo CaptureInfo,
    CaptureError CaptureError) : ICommand, IMaintenanceProcessMessage; 