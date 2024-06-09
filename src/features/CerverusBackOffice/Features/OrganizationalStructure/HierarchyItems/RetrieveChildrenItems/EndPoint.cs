using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cerverus.BackOffice.Features.OrganizationalStructure.HierarchyItems.RetrieveChildrenItems;

[ApiController]
[Route("api/locations/")]
public class RetrieveChildrenController(IHierarchyItemEntityQueryProvider entityQueryProvider): ControllerBase
{
    [HttpGet("{parentId}/children")]
    [
        ProducesResponseType(StatusCodes.Status200OK),
      //  Produces("application/json;domain-model=Cerverus.HierarchyItemList;version1.0.0")
    ]
    public async Task<IEnumerable<HierarchyItem>> GetChildren(string parentId)
    {
        var parent = (string.IsNullOrEmpty(parentId) || parentId == "root") ? string.Empty : parentId;
        var items = await entityQueryProvider.GetItems(parent);
        return items;
    }
}