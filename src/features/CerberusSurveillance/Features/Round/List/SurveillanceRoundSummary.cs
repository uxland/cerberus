using Cerberus.Core.Domain;
using Cerberus.Surveillance.Features.Features.Round.Create;

namespace Cerberus.Surveillance.Features.Features.Round.List;

public record SurveillanceRoundSummary(string Id, string RootLocationId, string Description, string CronExpression, string? AssignedTo) : IEntity
{
    public static SurveillanceRoundSummary Create(SurveillanceRoundCreated @event) =>
        new(@event.Id, @event.RootLocationId, @event.Description, @event.CronExpression, @event.AssignedTo);
}