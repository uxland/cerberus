using Cerberus.Core.Domain;
using System.Collections.Generic;

namespace Cerberus.Surveillance.Features.Features.Round;

public partial class SurveillanceRound : AggregateRoot
{
    public SurveillanceRound() : base()
    {
    }

    public string RootLocationId { get; private set; } 
    public string Description { get; private set; }
    public string CronExpression { get; private set; } 
    public int? EstimatedDuration { get; private set; } 
    public string? AssignedTo { get; private set; } 
    public List<IInspection> Inspections { get; private set; } = new List<IInspection>();
}