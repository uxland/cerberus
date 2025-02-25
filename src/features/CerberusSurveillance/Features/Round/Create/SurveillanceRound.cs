using Cerberus.Surveillance.Features.Features.Round.Create;

namespace Cerberus.Surveillance.Features.Features.Round.Create;

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
                cmd.Inspections
            )
        );
    }

    public void Apply(SurveillanceRoundCreated @event)
    {
        this.Id = @event.Id;
        this.RootLocationId = @event.RootLocationId;
        this.Description = @event.Description;
        this.CronExpression = @event.CronExpression;
        this.EstimatedDuration = @event.EstimatedDuration;
        this.AssignedTo = @event.AssignedTo;
        this.Inspections = @event.Inspections.ToList();
    }
}