using Cerberus.BackOffice.Features.OrganizationalStructure.Shared;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.HierarchyItems.ListLocationSubHierarchy;

public record LocationHierarchicalItem(
    string Id,
    string Description,
    HierarchicalItemType Type,
    List<LocationHierarchicalItem> Children );