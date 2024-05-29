using Cerverus.Core.Domain;
using Cerverus.Features.Features.Captures;
using Cerverus.Maintenance.Features.Features.Analysis;
using Cerverus.Maintenance.Features.Features.Shared;

namespace Cerverus.Maintenance.Features.Features.Issues;

public partial class MaintenanceIssue: AggregateRoot
{
    public MaintenanceIssue(){}
    
    public CaptureInfo CaptureInfo { get; set; }
    
    public CaptureError? CaptureError { get; set; }
    
    public List<FilterResult> AnalysisErrors { get; set; }
    
    public MaintenanceIssueStatus Status { get; set; }
    
}