using Cerberus.Core.Domain;

namespace Cerberus.Surveillance.Features.Features.Run.Trigger.EnrollRounds;

public record RoundsEnrolledToTrigger(HashSet<string> RoundIds) : IDomainEvent;