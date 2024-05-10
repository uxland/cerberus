using Cerverus.Core.Domain;
using Cerverus.Features.Features.OrganizationalStructure.Location.AppendLocations;

namespace Cerverus.Features.Features.OrganizationalStructure.Shared;

internal interface IHierarchySetupCommandFactoryItem
{
    bool CanProduce(AppendHierarchyItem item);
    
    IBaseCommand Produce(AppendHierarchyItem item);
}