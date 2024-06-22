using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.Captures.Triggers.Create;

public record CaptureTriggerCreated(string RecurrencePattern, HashSet<string> CameraIds): IDomainEvent;