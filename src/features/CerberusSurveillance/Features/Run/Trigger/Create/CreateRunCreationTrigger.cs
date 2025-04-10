namespace Cerberus.Surveillance.Features.Features.Run.Trigger.Create;

public record CreateRunCreationTrigger(string RecurrencePattern, HashSet<string> RoundIds);