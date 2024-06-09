using Cerverus.BackOffice.Features.OrganizationalStructure.HierarchyItems;

namespace Cerverus.UI.Components.Layout;

public record NavigationMenuItem(HierarchyItem Item, List<NavigationMenuItem> Children)
{
    public bool HasChildren => Children.Any();
}
