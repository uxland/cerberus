using Cerverus.BackOffice.Features.OrganizationalStructure.Location.AppendLocations;
using Cerverus.Core.Domain;

namespace Cerverus.BackOffice.Features.OrganizationalStructure.Shared;

public interface IHierarchySetupCommandFactoryItem
{
    bool CanProduce(AppendHierarchyItem item);
    
    IBaseCommand Produce(AppendHierarchyItem item);
}