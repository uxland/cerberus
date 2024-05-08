using Cerverus.Core.Domain;

namespace Cerverus.Features.Features.OrganizationalStructure.Location.AppendLocations;

public enum OverrideMode
{
    Merge,
    Replace
}

public record AppendLocation(
    string Id,
    string? ParentId,
    string Description,
    CameraAdminSettings? DefaultCameraAdminSettings,
    CameraFunctionalSettings? DefaultCameraFunctionalSettings,
    OverrideMode AdminSettingsOverrideMode,
    OverrideMode FunctionalSettingsOverrideMode
): ICommand;

public record AppendLocations(
    List<AppendLocation> Locations
    ): ICommand;