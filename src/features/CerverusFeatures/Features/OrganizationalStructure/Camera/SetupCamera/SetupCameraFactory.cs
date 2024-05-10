using Cerverus.Core.Domain;
using Cerverus.Features.Features.OrganizationalStructure.Location.AppendLocations;
using Cerverus.Features.Features.OrganizationalStructure.Shared;

namespace Cerverus.Features.Features.OrganizationalStructure.Camera.SetupCamera;

internal class SetupCameraFactory : IHierarchySetupCommandFactoryItem
{
    public bool CanProduce(AppendHierarchyItem item)
    {
        return item.Type == HierarchicalItemType.Camera;
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