using Cerverus.Core.Domain;
using Cerverus.Features.Features.OrganizationalStructure.Location.AppendLocations;

namespace Cerverus.Features.Features.OrganizationalStructure.Shared;

public sealed class HierarchySetupCommandFactory(IEnumerable<IHierarchySetupCommandFactoryItem> factories)
{
    public IBaseCommand Produce(AppendHierarchyItem item)
    {
        var factory = factories.FirstOrDefault(f => f.CanProduce(item));
        if(factory == null)
            throw new InvalidOperationException($"No factory found for item type {item.Type}");
        return factory.Produce(item);
    }
}