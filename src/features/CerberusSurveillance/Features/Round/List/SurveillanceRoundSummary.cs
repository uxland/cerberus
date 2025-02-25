using Cerberus.Core.Domain;
using Cerberus.Surveillance.Features.Features.Round.Create;

namespace Cerberus.Surveillance.Features.Features.Round.List;

public record SurveillanceRoundSummary(string Id, string Description, string CronExpression) : IEntity
{
    public static SurveillanceRoundSummary Create(SurveillanceRoundCreated @event) =>
        new(@event.Id, @event.Description, @event.CronExpression);
}