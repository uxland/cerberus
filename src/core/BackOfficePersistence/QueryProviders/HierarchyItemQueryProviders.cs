using Cerverus.Core.MartenPersistence.QueryProviders;
using Cerverus.Features.Features.OrganizationalStructure.HierarchyItems;
using Marten;

namespace Cerverus.BackOffice.Persistence.QueryProviders;

internal class HierarchyItemQueryProviders(IQuerySession querySession) : QueryProvider<HierarchyItem>(querySession), IHierarchyItemQueryProvider
{
    private readonly IQuerySession _querySession = querySession;

    public async Task<IEnumerable<HierarchyItem>> GetItems(string parent)
    {
        var parentId = string.IsNullOrEmpty(parent) ? null : parent;
        var query = parentId == "root" ? 
            _querySession.Query<HierarchyItem>().Where(x => x.ParentId == null || x.ParentId == parent) : 
            _querySession.Query<HierarchyItem>().Where(x => x.ParentId == parentId); 
            
        var items = await query.ToListAsync();
        return items;
    }
}