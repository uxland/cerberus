using Cerberus.Core.Domain;
using Cerberus.Surveillance.Features.Features.Operation.CreateOrUpdate;

namespace Cerberus.Surveillance.Features.Features.Operation.List;

public record SurveillanceOperationSummary(string Id, string Description, int RoundsUsage = 0, int CamerasUsage = 0) : IEntity
{
    private SurveillanceOperationSummary(string id, OperationSettings settings) : this(id, settings.Description)
    {
    }

    public static SurveillanceOperationSummary Create(SurveillanceOperationCreated @event) =>
        new(@event.Id, @event.Settings);
    public static SurveillanceOperationSummary Apply(SurveillanceOperationUpdated @event) =>
        new(@event.Id, @event.Settings);
}