using Cerberus.Core.Domain;
using Cerberus.Maintenance.Features.Features.Analysis;
using Cerberus.Maintenance.Features.Features.Shared;

namespace Cerberus.Maintenance.Features.Features.MaintenanceChecks;

public record MaintenanceCheckCreated(string MaintenanceProcessId, CaptureInfo CaptureInfo, List<FilterResult> AnalysisResults, MaintenanceCheckStatus Status) : IDomainEvent;