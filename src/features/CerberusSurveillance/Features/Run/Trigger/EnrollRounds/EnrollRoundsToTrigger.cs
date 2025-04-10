namespace Cerberus.Surveillance.Features.Features.Run.Trigger.EnrollRounds;

public record EnrollRoundsToTrigger(string TriggerId, HashSet<string> RoundIds);