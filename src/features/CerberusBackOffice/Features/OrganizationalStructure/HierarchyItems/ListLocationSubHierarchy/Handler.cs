using Cerberus.BackOffice.Features.OrganizationalStructure.HierarchyItems.Specs;
using Cerberus.Core.Domain;
using Cerberus.Core.Domain.Errors;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.HierarchyItems.ListLocationSubHierarchy;

public static class Handler
{
    public static async Task<List<LocationHierarchicalItem>> Handle(ListLocationSubHierarchy query, IReadModelQueryProvider queryProvider)
    {
        var parentItem = await queryProvider.RehydrateOrFail<HierarchyItem>(query.LocationId);
         var descendants = await queryProvider.List(new HierarchyItemDescendantSpec(parentItem.Path));
         return descendants.BuildHierarchy(parentItem.Id);
    }
    private static List<LocationHierarchicalItem> BuildHierarchy(this IReadOnlyList<HierarchyItem> items, string parentId = null)
    {
        return items
            .Where(item => item.ParentId == parentId)
            .Select(item => new LocationHierarchicalItem(
                item.Id,
                item.Description,
                item.Type,
                BuildHierarchy(items, item.Id)))
            .ToList();
    }
}
