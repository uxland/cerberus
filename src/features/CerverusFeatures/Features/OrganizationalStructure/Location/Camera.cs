using Cerverus.Core.Domain;

namespace Cerverus.Features.Features.OrganizationalStructure.Location;

public class Camera: AggregateRoot, IOrganizationStructureItem
{
    public string Path { get; private set; }
    public string Description { get; private set; }
    public CameraAdminSettings? AdminSettings { get; private set; }
    public CameraFunctionalSettings? FunctionalSettings { get; private set; }
}