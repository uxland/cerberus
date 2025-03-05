using Cerberus.Core.Domain;

namespace Cerberus.Surveillance.Features.Features.Operation.Create;

public record SurveillanceOperationCreated(string Id, string Description, IEnumerable<IOperationQuestion> Questions) : IDomainEvent;