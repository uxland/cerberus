using Cerverus.Core.Domain;
using Cerverus.Features.Features.OrganizationalStructure.Shared;

namespace Cerverus.Features.Features.OrganizationalStructure.Camera;

public partial class Camera: AggregateRoot, IOrganizationStructureItem
{
    public Camera(){}
    public string Path { get; private set; }
    public string ParentId { get; private set; }
    public string Description { get; private set; }
    public CameraAdminSettings? AdminSettings { get; private set; }
    public CameraFunctionalSettings? FunctionalSettings { get; private set; }
}

public interface ICameraQueryProvider : IQueryProvider<Camera>;