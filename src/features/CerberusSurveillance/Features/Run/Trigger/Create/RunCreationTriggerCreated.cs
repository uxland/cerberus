using Cerberus.Core.Domain;

namespace Cerberus.Surveillance.Features.Features.Run.Trigger.Create;

public record RunCreationTriggerCreated(
    string RecurrencePattern,
    HashSet<string> RoundIds
) : IDomainEvent;