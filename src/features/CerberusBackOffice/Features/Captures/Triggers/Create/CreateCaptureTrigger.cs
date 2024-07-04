namespace Cerberus.BackOffice.Features.Captures.Triggers.Create;

public record class CreateCaptureTrigger(string RecurrencePattern, HashSet<string> CameraIds);