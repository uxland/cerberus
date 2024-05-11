using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cerverus.Features.Features.OrganizationalStructure.HierarchyItems.RetrieveChildrenItems;

[ApiController]
[Route("api/locations/")]
public class RetrieveChildrenController(IHierarchyItemQueryProvider queryProvider): ControllerBase
{
    [HttpGet("{parentId}/children")]
    [
        ProducesResponseType(StatusCodes.Status200OK),
      //  Produces("application/json;domain-model=Cerverus.HierarchyItemList;version1.0.0")
    ]
    public async Task<IEnumerable<HierarchyItem>> GetChildren(string parentId)
    {
        var items = await queryProvider.GetItems(parentId);
        return items;
    }
}