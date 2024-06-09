using Cerverus.BackOffice.Features.OrganizationalStructure.Shared;
using Cerverus.Core.Domain;

namespace Cerverus.BackOffice.Features.OrganizationalStructure.Camera.SetupCamera;

public record CameraCreated(
    string Id,
    string ParentId,
    string Description,
    CameraAdminSettings AdminSettings,
    CameraFunctionalSettings FunctionalSettings,
    string Path
    ) : IDomainEvent;


public record class CameraUpdated(
    string ParentId,
    string Description,
    CameraAdminSettings AdminSettings,
    CameraFunctionalSettings FunctionalSettings,
    string Path
    ): IDomainEvent;
    
public record class CameraLocationChanged(
    string previousLocationId,
    string newLocationId,
    string Path
    ): IDomainEvent;