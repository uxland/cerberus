using Cerberus.BackOffice.Features.OrganizationalStructure.Shared;
using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Location.AppendLocations;

public record AppendHierarchyItem(
    HierarchicalItemType Type,
    string Id,
    string? ParentId,
    string Description,
    CameraAdminSettings? DefaultCameraAdminSettings
): ICommand;

public record AppendHierarchyItems(
    List<AppendHierarchyItem> Items
    ): ICommand;
    
public record SetupLocation(string Id,
    string? ParentId,
    string Description,
    CameraAdminSettings? DefaultCameraAdminSettings
    ): ICommand, IHierarchyItem;

public record CreateLocation(string Id,
    string? ParentId,
    string Description,
    CameraAdminSettings? DefaultCameraAdminSettings
    ): ICommand, IHierarchyItem;
    
public record AppendLocationRequest(
    string? Id,
    string? ParentId,
    string Description,
    string? CapturePattern,
    CameraCredentials? CameraCredentials
    ): ICommand;