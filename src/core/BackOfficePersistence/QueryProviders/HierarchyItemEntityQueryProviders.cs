using Cerberus.BackOffice.Features.OrganizationalStructure.HierarchyItems;
using Cerberus.Core.MartenPersistence.QueryProviders;
using Marten;

namespace Cerberus.BackOffice.Persistence.QueryProviders;

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