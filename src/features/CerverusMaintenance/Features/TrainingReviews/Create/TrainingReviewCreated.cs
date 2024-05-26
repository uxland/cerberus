using Cerverus.Core.Domain;
using Cerverus.Maintenance.Features.Features.Analysis;
using Cerverus.Maintenance.Features.Features.Shared;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.TrainingReviews;

public record TrainingReviewCreated(string MaintenanceProcessId, CaptureInfo CaptureInfo, List<FilterResult> AnalysisResults, Instant Timestamp): IDomainEvent;