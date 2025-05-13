using Cerberus.Core.Domain;
using NodaTime;
namespace Cerberus.Surveillance.Features.Features.Round;

public partial class SurveillanceRound: AggregateRoot
{
    public SurveillanceRound()
    {
        
    }
    public string ExecutionRecurrencePattern { get; set; }
    public string? AssignedGroupId { get;  set; }
    public string? RootLocationId { get;  set; }
    public string? Description { get; set; }
    
    public bool DeferredExecution { get; set; }
    
    public int? ClipDuration { get; set; }
    
    public List<Inspection> Inspections { get;  set; }
    
    public Duration? EstimatedDuration { get;  set; }
    
  
    
}