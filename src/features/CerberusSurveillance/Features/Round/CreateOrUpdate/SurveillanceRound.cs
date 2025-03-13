using Cerberus.Surveillance.Features.Features.Round.CreateOrUpdate;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Round;

public partial class SurveillanceRound
{
    public SurveillanceRound(CreateRound cmd)
    {
        var settings = cmd.Settings;
        this.ApplyUncommittedEvent(
            new SurveillanceRoundCreated(
                Guid.NewGuid().ToString(),
                settings
            )
        );
    }

    public void Handle(UpdateRound cmd)
    {
        this.ApplyUncommittedEvent(
            new SurveillanceRoundUpdated(this.Id, cmd.Settings));
    }
    public void Apply(SurveillanceRoundCreated @event)
    {
        this.Id = @event.Id;
        this.UpdateSettings(@event.Settings);
    }

    public void Apply(SurveillanceRoundUpdated @event)
    {
        this.UpdateSettings(@event.Settings);
    }

    private void UpdateSettings(RoundSettings settings)
    {
        this.RootLocationId = @settings.RootLocationId;
        this.Description = @settings.Description;
        this.ExecutionRecurrencePattern = @settings.CronExpression;
        this.EstimatedDuration = @settings.EstimatedDuration.HasValue ? Duration.FromMinutes(@settings.EstimatedDuration.Value) : null;
        this.AssignedTo = @settings.AssignedTo;
        this.Inspections = @settings.Inspections.ToList();
    }
}