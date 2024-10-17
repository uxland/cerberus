
using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.HierarchyItems.GetHierarchyItem;

public record GetHierarchyItem(string Id) : ICommand<string?>;