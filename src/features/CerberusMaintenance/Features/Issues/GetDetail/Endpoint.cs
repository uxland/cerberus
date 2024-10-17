using Cerberus.Core.Domain;
using Cerberus.Maintenance.Features.Features.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cerberus.Maintenance.Features.Features.Issues.GetDetail;


[ApiController]
[Route("api/maintenance-issues")]
[Produces("application/json")]
public class MaintenanceIssuesController : ControllerBase
{
    public const string ProducesMediaType = "application/json;domain-model=Cerberus.Maintenance.MaintenanceIssueDetail;version=1.0";
    [HttpGet("{id}")]
    [
        ProducesResponseType(StatusCodes.Status200OK, Type = typeof(MaintenanceIssueDetail)),
        ProducesResponseType(StatusCodes.Status404NotFound),
        // Produces(ProducesMediaType)
    ]
    [Authorize(Policy = MaintenancePolicies.User)]
    public async Task<IActionResult> GetDetail(string id, [FromServices]IMaintenanceIssueEntityQueryProvider entityQueryProvider)
    {
        var detail = await entityQueryProvider.RehydrateAsJson(id);
        return string.IsNullOrEmpty(detail) ? NotFound() : Ok(detail);
    }
}

public interface IMaintenanceIssueEntityQueryProvider: IEntityQueryProvider<MaintenanceIssueDetail>;