
using Cerverus.Core.Domain;
using Cerverus.Maintenance.Features.Features.Analysis;
using Cerverus.Maintenance.Features.Features.MaintenanceChecks;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.TrainingReviews;

public record TrainingReviewCompleted(string MaintenanceProcessId, string UserId, Dictionary<string, FilterResultReview> Reviews, Instant At, List<AnalysisFailure> Failures, List<FilterResult> FixedResults) : IDomainEvent, IMaintenanceProcessMessage;