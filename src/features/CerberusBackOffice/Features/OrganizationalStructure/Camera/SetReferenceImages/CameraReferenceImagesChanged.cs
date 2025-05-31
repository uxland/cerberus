using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Camera.SetReferenceImages;

public record CameraReferenceImagesChanged(
    string CameraId,
    string CameraImageUrl,
    string CameraImageThumbnailUrl
    ): IDomainEvent;