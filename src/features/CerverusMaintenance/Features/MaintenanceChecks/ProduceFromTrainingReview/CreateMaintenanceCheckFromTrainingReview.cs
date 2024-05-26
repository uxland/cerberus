using Cerverus.Core.Domain;
using Cerverus.Maintenance.Features.Features.Analysis;
using Cerverus.Maintenance.Features.Features.Shared;

namespace Cerverus.Maintenance.Features.Features.MaintenanceChecks;

public record CreateMaintenanceCheckFromTrainingReview(string MaintenanceProcessId, CaptureInfo CaptureInfo, string ReviewerUser, List<FilterResult> AnalysisResults): ICommand, IMaintenanceProcessMessage;