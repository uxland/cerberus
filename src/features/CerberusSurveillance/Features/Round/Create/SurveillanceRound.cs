using Cerberus.Surveillance.Features.Features.Round.Create;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Round;

public partial class SurveillanceRound
{
    public SurveillanceRound(CreateRound cmd)
    {
        this.ApplyUncommittedEvent(
            new SurveillanceRoundCreated(
                cmd.Id!,
                cmd.RootLocationId,
                cmd.Description,
                cmd.CronExpression,
                cmd.EstimatedDuration,
                cmd.AssignedTo,
                new List<Inspection>()
            )
        );
    }

    public void Apply(SurveillanceRoundCreated @event)
    {
        this.Id = @event.Id;
        this.RootLocationId = @event.RootLocationId;
        this.Description = @event.Description;
        this.ExecutionRecurrencePattern = @event.CronExpression;
        this.EstimatedDuration = @event.EstimatedDuration.HasValue ? Duration.FromMinutes(@event.EstimatedDuration.Value) : null;
        this.AssignedTo = @event.AssignedTo;
        this.Inspections = @event.Inspections.ToList();
    }
}