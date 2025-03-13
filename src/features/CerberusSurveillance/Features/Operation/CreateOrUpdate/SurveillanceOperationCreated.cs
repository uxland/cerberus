using Cerberus.Core.Domain;

namespace Cerberus.Surveillance.Features.Features.Operation.CreateOrUpdate;

public record SurveillanceOperationCreated(
    string Id,
    OperationSettings Settings
) : IDomainEvent;

public record SurveillanceOperationUpdated(
    string Id,
    OperationSettings Settings
) : IDomainEvent;