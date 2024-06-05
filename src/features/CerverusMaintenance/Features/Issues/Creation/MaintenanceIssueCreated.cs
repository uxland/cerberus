using Cerverus.Core.Domain;
using Cerverus.Features.Features.Captures;
using Cerverus.Maintenance.Features.Features.Analysis;
using Cerverus.Maintenance.Features.Features.Shared;
using Cerverus.Maintenance.Features.Features.TrainingReviews;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.Issues;

public record MaintenanceIssueCreated(
    string MaintenanceProcessId, 
    CaptureInfo CaptureInfo, 
    CaptureError? CaptureError, 
    List<FilterResult> Errors, 
    MaintenanceIssueStatus Status, 
    MaintenanceIssueCreation Creation) : IDomainEvent;