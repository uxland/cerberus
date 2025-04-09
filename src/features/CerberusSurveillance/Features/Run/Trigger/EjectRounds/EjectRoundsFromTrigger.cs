namespace Cerberus.Surveillance.Features.Features.Run.Trigger.EjectRounds;

public record EjectRoundsFromTrigger(string TriggerId, HashSet<string> RoundIds);