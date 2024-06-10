using Cerberus.Core.Domain;
using Cerberus.Maintenance.Features.Features.Analysis;
using Cerberus.Maintenance.Features.Features.Shared;

namespace Cerberus.Maintenance.Features.Features.TrainingReviews.Create;

public record CreateTrainingReview(string MaintenanceProcessId, CaptureInfo CaptureInfo, List<FilterResult> AnalysisResults): ICommand<TrainingReviews.TrainingReview>;