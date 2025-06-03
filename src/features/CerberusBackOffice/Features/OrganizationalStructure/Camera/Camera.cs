using Cerberus.BackOffice.Features.OrganizationalStructure.Shared;
using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Camera;

public partial class Camera: AggregateRoot, IOrganizationStructureItem
{
    public Camera(){}
    public string Path { get; set; }
    public string ParentId { get; set; }
    public string Description { get; set; }
    public CameraAdminSettings AdminSettings { get; set; }
    public CameraFunctionalSettings FunctionalSettings { get; set; }
    public string? BrandName { get; set; }
    public string? ModelName { get; set; }
    public decimal? Price { get; set; }
    
    public int? ManufactureYear { get; set; }
    
    public string CameraImageUrl { get; set; }
    
    public string CameraImageThumbnailUrl { get; set; }
}

public interface ICameraEntityQueryProvider : IEntityQueryProvider<Camera>
{
    Task<IEnumerable<string>> GetCameraIdsByPath(string path);
}