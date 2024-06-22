using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.Captures.Triggers.EnrollCameras;

public record CamerasEnrolledToTrigger(string TriggerId, HashSet<string> CameraIds): IDomainEvent;