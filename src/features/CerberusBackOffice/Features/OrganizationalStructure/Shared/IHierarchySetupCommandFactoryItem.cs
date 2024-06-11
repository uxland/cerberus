using Cerberus.BackOffice.Features.OrganizationalStructure.Location.AppendLocations;
using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Shared;

public interface IHierarchySetupCommandFactoryItem
{
    bool CanProduce(AppendHierarchyItem item);
    
    IBaseCommand Produce(AppendHierarchyItem item);
}