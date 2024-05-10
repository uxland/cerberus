namespace Cerverus.Features.Features.OrganizationalStructure.Shared;

public interface IHierarchyItem
{
    string Id { get; }
    string? ParentId { get; }
}