using BackOfficeUI.Infrastructure;
using Cerverus.Features.Features.OrganizationalStructure.HierarchyItems;

namespace BackOfficeUI.Components.Layout;

public class TreeItemsLoader(ApiClient apiClient)
{
    public async Task<IEnumerable<HierarchyItem>> LoadItems(string parent)
    {
        return await apiClient.GetItems<IEnumerable<HierarchyItem>>($"locations/{parent}/children") ?? [];
    }
}