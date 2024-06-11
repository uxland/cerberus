using Cerberus.BackOffice.Features.Captures;
using Cerberus.Core.Domain;
using Cerberus.Maintenance.Features.Features.Analysis;
using Cerberus.Maintenance.Features.Features.Shared;
using NodaTime;

namespace Cerberus.Maintenance.Features.Features.Issues;

public partial class MaintenanceIssue: AggregateRoot
{
    public MaintenanceIssue(){}
    
    public String MaintenanceProcessId { get; set; }
    public CaptureInfo CaptureInfo { get; set; }
    
    public CaptureError? CaptureError { get; set; }
    
    public List<FilterResult> Errors { get; set; }
    
    public MaintenanceIssueStatus Status { get; set; }
    
    public MaintenanceExecution? Execution { get; set; }
    
    public string SentBy { get; set; }
    
    public MaintenanceIssueCreation Creation { get; set; }
    
}

public record MaintenanceExecution(string StartedBy, Instant StartedAt, string? EndedBy = null,  Instant? EndedAt = null, string? Comment = null);

public record MaintenanceIssueCreation(string By, Instant At);