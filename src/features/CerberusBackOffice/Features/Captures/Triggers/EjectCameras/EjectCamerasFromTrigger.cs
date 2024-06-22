namespace Cerberus.BackOffice.Features.Captures.Triggers.EjectCameras;

public record EjectCamerasFromTrigger(string TriggerId, HashSet<string> CameraIds);