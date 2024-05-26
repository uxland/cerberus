using Cerverus.Core.Domain;
using Cerverus.Maintenance.Features.Features.Analysis;
using Cerverus.Maintenance.Features.Features.Shared;

namespace Cerverus.Maintenance.Features.Features.TrainingReviews;

public record CreateTrainingReview(string MaintenanceProcessId, CaptureInfo CaptureInfo, List<FilterResult> AnalysisResults): ICommand<TrainingReview>;