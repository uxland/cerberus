using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cerverus.Features.Features.OrganizationalStructure.HierarchyItems.GetAll;

[ApiController]
[Route("api/[controller]")]
public class LocationsController(IHierarchyItemQueryProvider queryProvider): ControllerBase
{
    [HttpGet]
    [
        ProducesResponseType(StatusCodes.Status200OK),
        // Produces("application/json;domain-model=Cerverus.HierarchyItemList;version1.0.0")
    ]
    public async Task<IEnumerable<HierarchyItem>> GetAll()
    {
        return await queryProvider.GetAll();
    }
}