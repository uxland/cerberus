using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.Captures.Triggers.EjectCameras;

public record CamerasEjectedFromTrigger(HashSet<string> CameraIds): IDomainEvent;

