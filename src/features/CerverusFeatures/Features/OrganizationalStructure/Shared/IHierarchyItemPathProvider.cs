using Cerverus.Core.Domain;
using Cerverus.Features.Features.Shared;

namespace Cerverus.Features.Features.OrganizationalStructure.Shared;

internal interface IHierarchyItemPathProvider
{
    public Task<string> GetPathAsync(IHierarchyItem hierarchyItem);
}

internal class HierarchicalItemPathProvider(IRepository<Location.Location> locationRepository) : 
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

    public IRepository<Location.Location> Repository => locationRepository;
}