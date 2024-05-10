using Cerverus.Features.Features.OrganizationalStructure.Camera.SetupCamera;
using Cerverus.Features.Features.OrganizationalStructure.Location.AppendLocations;
using Cerverus.Features.Features.OrganizationalStructure.Shared;

namespace Cerverus.Features.Features.OrganizationalStructure.ReadModels;

public record class HierarchyItem(
    string Id,
    string? ParentId,
    string Description,
    string Path,
    HierarchicalItemType Type
)
{
    public static HierarchyItem Create(LocationCreated locationCreated) =>
        new HierarchyItem(locationCreated.Id, locationCreated.ParentId, locationCreated.Description, locationCreated.Path, HierarchicalItemType.Location);
    
    public static HierarchyItem Create(CameraCreated cameraCreated) =>
        new HierarchyItem(cameraCreated.Id, cameraCreated.ParentId, cameraCreated.Description, cameraCreated.Path, HierarchicalItemType.Camera);
    
    public HierarchyItem Apply(CameraLocationChanged cameraLocationChanged) =>
        this with
        {
            ParentId = cameraLocationChanged.newLocationId,
            Path = cameraLocationChanged.Path
        };
    
    public HierarchyItem Apply(LocationUpdated locationUpdated) =>
        this with
        {
            Description = locationUpdated.Description,
            Path = locationUpdated.Path,
            ParentId = locationUpdated.ParentId
        };
    
    public HierarchyItem Apply(CameraUpdated cameraUpdated) =>
        this with
        {
            Description = cameraUpdated.Description,
            ParentId = cameraUpdated.ParentId,
            Path = cameraUpdated.Path
        };
}
