using Cerberus.BackOffice.Features.OrganizationalStructure.Location.AppendLocations;
using Cerberus.BackOffice.Features.OrganizationalStructure.Shared;
using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Camera.SetupCamera;

public record SetupCameraCommand(
    string Id,
    string ParentId,
    string Description,
    CameraAdminSettings? AdminSettings,
    CameraFunctionalSettings? FunctionalSettings
) : ICommand, IHierarchyItem;

public class SetupLocationFactory : IHierarchySetupCommandFactoryItem
{
    public bool CanProduce(AppendHierarchyItem item)
    {
        return item.Type == HierarchicalItemType.Location;
    }

    public IBaseCommand Produce(AppendHierarchyItem item)
    {
        return new SetupLocation(
            item.Id,
            item.ParentId,
            item.Description,
            item.DefaultCameraAdminSettings,
            item.DefaultCameraFunctionalSettings
        );
    }
}

public record AppendCameraRequest(
    string? Id,
    string ParentId,
    string Description,
    string? CapturePattern,
    string Url,
    CameraCredentials? CameraCredentials
)
{
    public SetupCameraCommand ToCreateCamera()
    {
        return new SetupCameraCommand(
            Id ?? Guid.NewGuid().ToString(),
            ParentId,
            Description,
            new CameraAdminSettings(IpAddress: Url, CameraCredentials, CapturePattern),
            null
        );
    }
}