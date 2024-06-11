using Cerberus.BackOffice.Features.OrganizationalStructure.Shared;
using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Location;

public partial class Location: AggregateRoot, IOrganizationStructureItem
{
    public Location(){}
    public string Path { get; set;}
    public string? ParentId { get; set;}
    public string Description { get; set;}
    public CameraFunctionalSettings? DefaultCameraFunctionalSettings { get; set;}
    public CameraAdminSettings? DefaultCameraAdminSettings { get; set;}
}