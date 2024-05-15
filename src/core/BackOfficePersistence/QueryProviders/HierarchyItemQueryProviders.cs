using Cerverus.Core.MartenPersistence.QueryProviders;
using Cerverus.Features.Features.OrganizationalStructure.HierarchyItems;
using Marten;

namespace Cerverus.BackOffice.Persistence.QueryProviders;

internal class HierarchyItemQueryProviders(IQuerySession querySession) : QueryProvider<HierarchyItem>(querySession), IHierarchyItemQueryProvider
{
    private readonly IQuerySession _querySession = querySession;

    public async Task<IEnumerable<HierarchyItem>> GetItems(string? parent)
    {
        var query =
            _querySession.Query<HierarchyItem>().Where(x => x.ParentId == parent); 
        
        var items = await query.ToListAsync();
        return items;
    }

    public async Task<IEnumerable<HierarchyItem>> GetAll()
    {
        var items = await _querySession.Query<HierarchyItem>().ToListAsync();
        return items;
    }
}