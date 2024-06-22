using Cerberus.BackOffice.Features.Shared;
using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Shared;

public interface IHierarchyItemPathProvider
{
    public Task<string> GetPathAsync(IHierarchyItem hierarchyItem);
}

public class HierarchicalItemPathProvider(IGenericRepository repository) : 
    IHierarchyItemPathProvider
{
    public async Task<string> GetPathAsync(IHierarchyItem hierarchyItem)
    {
        if(string.IsNullOrEmpty(hierarchyItem.ParentId))
            return hierarchyItem.Id;
        var parent = await repository.RehydrateOrThrow<Location.Location>(hierarchyItem.ParentId);
        return $"{parent.Path}>{hierarchyItem.Id}";
    }

}