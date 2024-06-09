using Cerverus.BackOffice.Features.OrganizationalStructure.Shared;
using Cerverus.Core.Domain;

namespace Cerverus.BackOffice.Features.OrganizationalStructure.Location.AppendLocations;

public record LocationCreated(
    string Id,
    string? ParentId,
    string Path,
    string Description,
    CameraAdminSettings? DefaultCameraAdminSettings,
    CameraFunctionalSettings? DefaultCameraFunctionalSettings) : IDomainEvent;
    
public record LocationUpdated(
    string Path,
    string? ParentId,
    string Description,
    CameraAdminSettings? DefaultCameraAdminSettings,
    CameraFunctionalSettings? DefaultCameraFunctionalSettings) : IDomainEvent;