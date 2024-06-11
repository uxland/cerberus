using Cerberus.Core.Domain;
using Cerberus.Maintenance.Features.Features.Analysis;
using Cerberus.Maintenance.Features.Features.Shared;
using Cerberus.Maintenance.Features.Features.Workflow;

namespace Cerberus.Maintenance.Features.Features.MaintenanceChecks;

public record CreateMaintenanceCheck(string MaintenanceProcessId, CaptureInfo CaptureInfo, List<FilterResult> FilterResults): ICommand, IMaintenanceProcessMessage;