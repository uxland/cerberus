
using Cerberus.Core.Domain;

namespace Cerberus.Surveillance.Features.Features.Run.MoveToInspection;

public record MovedToInspection(string Id, string InspectionId): IDomainEvent;