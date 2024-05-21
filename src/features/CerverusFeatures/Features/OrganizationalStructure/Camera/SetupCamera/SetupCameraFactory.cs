using Cerverus.Core.Domain;
using Cerverus.Features.Features.OrganizationalStructure.Location.AppendLocations;
using Cerverus.Features.Features.OrganizationalStructure.Shared;

namespace Cerverus.Features.Features.OrganizationalStructure.Camera.SetupCamera;

public class SetupCameraFactory : IHierarchySetupCommandFactoryItem
{
    public bool CanProduce(AppendHierarchyItem item)
    {
        return item.Type == HierarchicalItemType.Camera;
    }

    public IBaseCommand Produce(AppendHierarchyItem item)
    {
        return new SetupCameraCommand(
            item.Id,
            item.ParentId!,
            item.Description,
            item.DefaultCameraAdminSettings,
            item.DefaultCameraFunctionalSettings
        );
    }
}