using Cerberus.Core.Domain;
using Cerberus.Surveillance.Features.Features.Operation.Create;

namespace Cerberus.Surveillance.Features.Features.Operation.List;

public record SurveillanceOperationSummary(string Id, string Description, int RoundsUsage = 0, int CamerasUsage = 0) : IEntity
{
    public static SurveillanceOperationSummary Create(SurveillanceOperationCreated @event) =>
        new(@event.Id, @event.Description);
}