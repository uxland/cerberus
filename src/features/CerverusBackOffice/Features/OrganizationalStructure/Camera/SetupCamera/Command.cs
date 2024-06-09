using Cerverus.BackOffice.Features.OrganizationalStructure.Location.AppendLocations;
using Cerverus.BackOffice.Features.OrganizationalStructure.Shared;
using Cerverus.Core.Domain;

namespace Cerverus.BackOffice.Features.OrganizationalStructure.Camera.SetupCamera;

public record SetupCameraCommand(
    string Id,
    string ParentId,
    string Description,
    CameraAdminSettings? AdminSettings,
    CameraFunctionalSettings? FunctionalSettings
    ): ICommand, IHierarchyItem;
    
    public class SetupLocationFactory: IHierarchySetupCommandFactoryItem
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