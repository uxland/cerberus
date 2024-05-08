using Cerverus.Core.Domain;

namespace Cerverus.Features.Features.OrganizationalStructure.Location.AppendLocations;

public record LocationCreated(
    string Id,
    string Path,
    string Description,
    CameraAdminSettings? DefaultCameraAdminSettings,
    CameraFunctionalSettings? DefaultCameraFunctionalSettings) : IDomainEvent;