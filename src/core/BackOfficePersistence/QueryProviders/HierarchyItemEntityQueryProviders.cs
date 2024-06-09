using Cerverus.BackOffice.Features.OrganizationalStructure.HierarchyItems;
using Cerverus.Core.MartenPersistence.QueryProviders;
using Marten;

namespace Cerverus.BackOffice.Persistence.QueryProviders;

public class HierarchyItemEntityQueryProviders(IQuerySession querySession) : EntityQueryProvider<HierarchyItem>(querySession), IHierarchyItemEntityQueryProvider
{
    

    public async Task<IEnumerable<HierarchyItem>> GetItems(string? parent)
    {
        var query =
            Session.Query<HierarchyItem>().Where(x => x.ParentId == parent); 
        
        var items = await query.ToListAsync();
        return items;
    }

    public async Task<IEnumerable<HierarchyItem>> GetAll()
    {
        var items = await Session.Query<HierarchyItem>().ToListAsync();
        return items;
    }
}