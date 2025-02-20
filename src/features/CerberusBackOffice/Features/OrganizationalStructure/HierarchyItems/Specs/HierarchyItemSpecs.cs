using System.Linq.Expressions;
using Cerberus.Core.Domain.Spec;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.HierarchyItems.Specs;

internal class HierarchyItemDescendantSpec(string parentPath) : Specification<HierarchyItem>
{
    public override bool IsSatisfiedBy(HierarchyItem item)
    {
        return item.Path.StartsWith(parentPath);
    }

    public override Expression<Func<HierarchyItem, bool>> ToExpression()
    {
        return item => item.Path.StartsWith(parentPath);
    }
}