using Cerverus.Core.Domain;
using Cerverus.Features.Features.Captures;
using Cerverus.Maintenance.Features.Features.Analysis;
using Cerverus.Maintenance.Features.Features.Shared;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.Issues;

public partial class MaintenanceIssue: AggregateRoot
{
    public MaintenanceIssue(){}
    
    public String MaintenanceProcessId { get; set; }
    public CaptureInfo CaptureInfo { get; set; }
    
    public CaptureError? CaptureError { get; set; }
    
    public List<FilterResult> AnalysisErrors { get; set; }
    
    public MaintenanceIssueStatus Status { get; set; }
    
    public MaintenanceExecution? Execution { get; set; }
    
}

public record MaintenanceExecution(string StartedBy, Instant StartedAt, string? EndedBy = null,  Instant? EndedAt = null, string? Comment = null);