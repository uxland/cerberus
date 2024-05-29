using Cerverus.Core.Domain;
using Cerverus.Maintenance.Features.Features.Analysis;
using Cerverus.Maintenance.Features.Features.MaintenanceChecks;
using Cerverus.Maintenance.Features.Features.Workflow;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.TrainingReviews.Complete;

public record TrainingReviewCompleted(string MaintenanceProcessId, string UserId, Dictionary<string, FilterResultReview> Reviews, ZonedDateTime At, List<AnalysisFailure> Failures, List<FilterResult> FixedResults) : IDomainEvent, IMaintenanceProcessMessage;