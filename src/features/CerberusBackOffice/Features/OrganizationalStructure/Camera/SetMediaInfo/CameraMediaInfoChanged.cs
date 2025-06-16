using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Camera.SetMediaInfo;

public record CameraMediaInfoChanged(string CameraId, VideoStreamMediaInfo NewMediaInfo): IDomainEvent;