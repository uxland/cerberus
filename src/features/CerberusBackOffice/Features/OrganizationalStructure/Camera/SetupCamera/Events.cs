using Cerberus.BackOffice.Features.OrganizationalStructure.Shared;
using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Camera.SetupCamera;

public record CameraCreated(
    string CameraId,
    string ParentId,
    string Description,
    CameraAdminSettings AdminSettings,
    CameraFunctionalSettings FunctionalSettings,
    string Path,
    string? BrandName,
    string? ModelName,
    decimal? Price,
    int? ManufactureYear
    ) : IDomainEvent;


public record CameraUpdated(
    string ParentId,
    string Description,
    CameraAdminSettings AdminSettings,
    CameraFunctionalSettings FunctionalSettings,
    string Path,
    string? BrandName,
    string? ModelName,
    decimal? Price,
    int? ManufactureYear
    ): IDomainEvent;
    
public record CameraLocationChanged(
    string PreviousLocationId,
    string NewLocationId,
    string Path
    ): IDomainEvent;

public record CameraRecurrencePatternChanged(
    string CameraId,
    string PreviousPattern,
    string NewPattern
    ): IDomainEvent; 