using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.HierarchyItems.GetHierarchyItem;
[ApiController]
[Route("api/hierarchy-items")]
[Produces("application/json")]
public class HierarchItemsController(IMessageBus bus): ControllerBase
{
    [HttpGet("{id}")]
    [
        ProducesResponseType(StatusCodes.Status200OK, Type = typeof(HierarchyItem)),
    ]
    [Authorize]
    public async Task<IActionResult> GetHierarchyItem(string id)
    {
        var result = await bus.InvokeAsync<string?>(new GetHierarchyItem(id));
        return string.IsNullOrEmpty(result) ? NotFound() : Ok(result);
    }
}