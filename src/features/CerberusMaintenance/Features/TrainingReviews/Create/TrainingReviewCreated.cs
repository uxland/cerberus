using Cerberus.Core.Domain;
using Cerberus.Maintenance.Features.Features.Analysis;
using Cerberus.Maintenance.Features.Features.Shared;
using NodaTime;

namespace Cerberus.Maintenance.Features.Features.TrainingReviews.Create;

public record TrainingReviewCreated(string MaintenanceProcessId, CaptureInfo CaptureInfo, List<FilterResult> AnalysisResults, Instant Timestamp): IDomainEvent;