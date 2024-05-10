using Cerverus.Core.Domain;
using Cerverus.Features.Features.OrganizationalStructure.Location.AppendLocations;
using Cerverus.Features.Features.OrganizationalStructure.Shared;

namespace Cerverus.Features.Features.OrganizationalStructure.Location;

public partial class Location: AggregateRoot, IOrganizationStructureItem
{
    public Location(){}
    public string Path { get; private set;}
    public string? ParentId { get; private set;}
    public string Description { get; private set;}
    public CameraFunctionalSettings? DefaultCameraFunctionalSettings { get; private set;}
    public CameraAdminSettings? DefaultCameraAdminSettings { get; private set;}

    
}
