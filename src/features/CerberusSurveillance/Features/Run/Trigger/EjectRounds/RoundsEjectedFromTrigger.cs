using Cerberus.Core.Domain;

namespace Cerberus.Surveillance.Features.Features.Run.Trigger.EjectRounds;

public record RoundsEjectedFromTrigger(HashSet<string> RoundIds): IDomainEvent;