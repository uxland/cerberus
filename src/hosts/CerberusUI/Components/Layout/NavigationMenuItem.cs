using Cerberus.BackOffice.Features.OrganizationalStructure.HierarchyItems;

namespace Cerberus.UI.Components.Layout;

public record NavigationMenuItem(HierarchyItem Item, List<NavigationMenuItem> Children)
{
    public bool HasChildren => Children.Any();
}
