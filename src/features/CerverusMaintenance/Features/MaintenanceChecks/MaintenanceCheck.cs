using Cerverus.Core.Domain;
using Cerverus.Features.Features.Captures;
using Cerverus.Maintenance.Features.Features.Analysis;
using Cerverus.Maintenance.Features.Features.Shared;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.MaintenanceChecks;

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