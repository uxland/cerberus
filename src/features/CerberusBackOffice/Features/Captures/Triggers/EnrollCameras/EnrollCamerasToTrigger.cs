namespace Cerberus.BackOffice.Features.Captures.Triggers.EnrollCameras;

public record EnrollCamerasToTrigger(string TriggerId, HashSet<string> CameraIds);