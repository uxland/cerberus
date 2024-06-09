using Cerverus.BackOffice.Features.Shared;
using Cerverus.Core.Domain;

namespace Cerverus.BackOffice.Features.OrganizationalStructure.Shared;

public interface IHierarchyItemPathProvider
{
    public Task<string> GetPathAsync(IHierarchyItem hierarchyItem);
}

public class HierarchicalItemPathProvider(IRepository<Location.Location> locationRepository) : 
    IHierarchyItemPathProvider,
    IRepositoryHandlerMixin<Location.Location>
{
    public async Task<string> GetPathAsync(IHierarchyItem hierarchyItem)
    {
        if(string.IsNullOrEmpty(hierarchyItem.ParentId))
            return hierarchyItem.Id;
        var parent = await this.Rehydrate(hierarchyItem.ParentId);
        return $"{parent.Path}>{hierarchyItem.Id}";
    }

    public IRepositoryBase<Location.Location> Repository => locationRepository;
}