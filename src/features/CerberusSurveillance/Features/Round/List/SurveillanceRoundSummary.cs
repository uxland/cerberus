using Cerberus.Core.Domain;
using Cerberus.Surveillance.Features.Features.Round.CreateOrUpdate;

namespace Cerberus.Surveillance.Features.Features.Round.List;

public record SurveillanceRoundSummary(string Id, string RootLocationId, string Description, string CronExpression, string? AssignedTo, bool DeferredExecution, int? ClipDuration) : IEntity
{
    private SurveillanceRoundSummary(string id, RoundSettings settings) : this(id, settings.RootLocationId, settings.Description, settings.CronExpression, settings.AssignedTo, settings.DeferredExecution, settings.ClipDuration)
    {
    }

    public static SurveillanceRoundSummary Create(SurveillanceRoundCreated @event) =>
        new(@event.Id, @event.Settings);
    public static SurveillanceRoundSummary Apply(SurveillanceRoundUpdated @event) =>
        new(@event.Id, @event.Settings);
}