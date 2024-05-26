
using Cerverus.Core.Domain;
using Cerverus.Maintenance.Features.Features.Analysis;
using Cerverus.Maintenance.Features.Features.Shared;

namespace Cerverus.Maintenance.Features.Features.MaintenanceChecks;

public record MaintenanceCheckCreated(string MaintenanceProcessId, CaptureInfo CaptureInfo, List<FilterResult> AnalysisResults, MaintenanceCheckStatus Status) : IDomainEvent;