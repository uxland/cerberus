namespace Cerberus.BackOffice.Features.Captures.Triggers.EnrollCameras;

public record class EnrollCamerasToTrigger(string TriggerId, HashSet<string> CameraIds);