using Cerberus.Core.Domain;
using NodaTime;
namespace Cerberus.Surveillance.Features.Features.Round;

public partial class SurveillanceRound: AggregateRoot
{
    public SurveillanceRound()
    {
        
    }
    public string ExecutionRecurrencePattern { get; private set; }
    public string? GroupAssigneeId { get;  private set; }
    public string? RootLocationId { get;  private set; }
    public string? Description { get; private set; }
    
    public List<Inspection> Inspections { get;  private set; }
    
    public Duration? EstimatedDuration { get;  private set; }
    
    public string? AssignedTo { get;  private set; }
    
}