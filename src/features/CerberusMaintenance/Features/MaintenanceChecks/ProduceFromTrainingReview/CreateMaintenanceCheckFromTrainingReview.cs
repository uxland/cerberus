using Cerberus.Core.Domain;
using Cerberus.Maintenance.Features.Features.Analysis;
using Cerberus.Maintenance.Features.Features.Shared;
using Cerberus.Maintenance.Features.Features.Workflow;

namespace Cerberus.Maintenance.Features.Features.MaintenanceChecks.ProduceFromTrainingReview;

public record CreateMaintenanceCheckFromTrainingReview(string MaintenanceProcessId, CaptureInfo CaptureInfo, string ReviewerUser, List<FilterResult> AnalysisResults): ICommand, IMaintenanceProcessMessage;