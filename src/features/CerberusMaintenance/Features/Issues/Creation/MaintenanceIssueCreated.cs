using Cerberus.BackOffice.Features.Captures;
using Cerberus.Core.Domain;
using Cerberus.Maintenance.Features.Features.Analysis;
using Cerberus.Maintenance.Features.Features.Shared;

namespace Cerberus.Maintenance.Features.Features.Issues;

public record MaintenanceIssueCreated(
    string MaintenanceProcessId, 
    CaptureInfo CaptureInfo, 
    CaptureError? CaptureError, 
    List<FilterResult> Errors, 
    MaintenanceIssueStatus Status, 
    MaintenanceIssueCreation Creation) : IDomainEvent;