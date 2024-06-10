using Cerberus.BackOffice.Features.OrganizationalStructure.Location.AppendLocations;
using Cerberus.BackOffice.Features.OrganizationalStructure.Shared;
using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Camera.SetupCamera;

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