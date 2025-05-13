using Cerberus.Core.Domain;
using Cerberus.Surveillance.Features.Features.Round.CreateOrUpdate;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Round;

public partial class SurveillanceRound:
    IDomainEventHandler<SurveillanceRoundCreated>,
    IDomainEventHandler<SurveillanceRoundUpdated>,
    IDomainEventHandler<SurveillanceRoundExecutionRecurrencePatternChanged>
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
        if(cmd.Settings.CronExpression != this.ExecutionRecurrencePattern)
            this.ApplyUncommittedEvent(
                new SurveillanceRoundExecutionRecurrencePatternChanged(
                    this.Id,
                    this.ExecutionRecurrencePattern,
                    cmd.Settings.CronExpression
                )
            );
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
    public void Apply(SurveillanceRoundExecutionRecurrencePatternChanged @event)
    {
        this.ExecutionRecurrencePattern = @event.NewRecurrencePattern;
    }

    private void UpdateSettings(RoundSettings settings)
    {
        this.RootLocationId = @settings.RootLocationId;
        this.Description = @settings.Description;
        this.ExecutionRecurrencePattern = @settings.CronExpression;
        this.EstimatedDuration = @settings.EstimatedDuration.HasValue ? Duration.FromMinutes(@settings.EstimatedDuration.Value) : null;
        this.AssignedGroupId = @settings.AssignedTo;
        this.DeferredExecution = @settings.DeferredExecution;
        this.ClipDuration = @settings.ClipDuration;
        this.Inspections = @settings.Inspections.ToList();
    }

    
}