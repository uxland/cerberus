using Cerberus.Core.Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.HierarchyItems.GetHierarchyItem;
[ApiController]
[Route("api/hierarchy-items")]
[Produces("application/json")]
public class HierarchItemsController(IReadModelQueryProvider queryProvider): ControllerBase
{
    [HttpGet("{id}")]
    [
        ProducesResponseType(StatusCodes.Status200OK, Type = typeof(HierarchyItem)),
    ]
    public async Task<IActionResult> GetHierarchyItem(string id)
    {
        var result = await queryProvider.RehydrateAsJson<HierarchyItem>(id);
        return string.IsNullOrEmpty(result) ? NotFound() : Ok(result);
    }
}