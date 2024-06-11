using Cerberus.Core.Domain;
using Cerberus.Maintenance.Features.Features.Analysis;
using Cerberus.Maintenance.Features.Features.Workflow;
using NodaTime;

namespace Cerberus.Maintenance.Features.Features.TrainingReviews;

public record TrainingReviewFulfilled(string MaintenanceProcessId, string UserId, Dictionary<string, FilterResultReview> Reviews, Instant At, List<AnalysisFailure> Failures, List<FilterResult> FixedResults) : IDomainEvent, IMaintenanceProcessMessage;