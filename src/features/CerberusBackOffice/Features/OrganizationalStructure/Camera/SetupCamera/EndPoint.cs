using Cerberus.BackOffice.Features.OrganizationalStructure.HierarchyItems.GetHierarchyItem;
using Cerberus.BackOffice.Features.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Camera.SetupCamera;

[ApiController]
[Route("api/[controller]")]
public class CamerasController(IMessageBus bus): ControllerBase
{
    [HttpPut]
    [Authorize(Roles = BackOfficeRoles.BackofficeAdmin)]
    public async Task<IActionResult> AppendCamera([FromBody] SetUpCameraRequest request)
    {
        var command = request.ToSetUpCamera();
        await bus.InvokeAsync(command);
        var addedItem = await bus.InvokeAsync<string?>(new GetHierarchyItem(command.Id));
        return string.IsNullOrEmpty(addedItem) ? NotFound() : Ok(addedItem);
    }
}