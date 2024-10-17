using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.HierarchyItems.GetHierarchyItem;

public static class Handler
{
    public static async Task<string?> Handle(GetHierarchyItem query, IReadModelQueryProvider queryProvider)
    {
        var result = await queryProvider.RehydrateAsJson<HierarchyItem>(query.Id);
        return result;
    }
}