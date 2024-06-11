using Cerberus.BackOffice.Features.Captures;
using Cerberus.Core.Domain;
using Cerberus.Maintenance.Features.Features.Analysis;
using Cerberus.Maintenance.Features.Features.Shared;
using NodaTime;

namespace Cerberus.Maintenance.Features.Features.MaintenanceChecks;

public partial class MaintenanceCheck: AggregateRoot
{
    public MaintenanceCheck()
    {
        
    }
    public string MaintenanceProcessId { get; set; }
    public CaptureError? CaptureError{get; set;}
    
    public CaptureInfo CaptureInfo { get; set; }
    
    public MaintenanceCheckStatus Status { get; set; }
    
    public List<FilterResult> AnalysisResults { get; set; }
    
    public Revision? Revision { get; set; }
}

public enum MaintenanceCheckStatus
{
    RevisionPending,
    Completed
}

public record Revision(string PerformedBy, Instant At);