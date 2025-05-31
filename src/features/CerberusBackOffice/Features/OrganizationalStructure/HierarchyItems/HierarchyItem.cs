using Cerberus.BackOffice.Features.OrganizationalStructure.Camera.SetReferenceImages;
using Cerberus.BackOffice.Features.OrganizationalStructure.Camera.SetupCamera;
using Cerberus.BackOffice.Features.OrganizationalStructure.Location.AppendLocations;
using Cerberus.BackOffice.Features.OrganizationalStructure.Shared;
using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.HierarchyItems;

public record HierarchyItem(
    string Id,
    string? ParentId,
    string Description,
    string Path,
    HierarchicalItemType Type,
    string? ImageUrl = null,
    string? ImageThumbnailUrl = null
): IEntity
{
    public static HierarchyItem Create(LocationCreated locationCreated) =>
        new(locationCreated.Id, locationCreated.ParentId, locationCreated.Description, locationCreated.Path, HierarchicalItemType.Location);
    
    public static HierarchyItem Create(CameraCreated cameraCreated) =>
        new(cameraCreated.CameraId, cameraCreated.ParentId, cameraCreated.Description, cameraCreated.Path, HierarchicalItemType.Camera);
    
    public HierarchyItem Apply(CameraLocationChanged cameraLocationChanged) =>
        this with
        {
            ParentId = cameraLocationChanged.NewLocationId,
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
    public HierarchyItem Apply(CameraReferenceImagesChanged cameraReferenceImagesChanged) =>
        this with
        {
            ImageUrl = cameraReferenceImagesChanged.CameraImageUrl,
            ImageThumbnailUrl = cameraReferenceImagesChanged.CameraImageThumbnailUrl
        };
}

public interface IHierarchyItemEntityQueryProvider: IEntityQueryProvider<HierarchyItem>
{
    Task<IEnumerable<HierarchyItem>> GetItems(string parent);
    Task<IEnumerable<HierarchyItem>> GetAll();
    
}