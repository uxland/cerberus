using Cerverus.Core.Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cerverus.Maintenance.Features.Features.Issues.GetDetail;


[ApiController]
[Route("api/maintenance-issues")]
public class MaintenanceIssuesController : ControllerBase
{
    public const string ProducesMediaType = "application/json;domain-model=Cerverus.Maintenance.MaintenanceIssueDetail;version=1.0";
    [HttpGet("{id}")]
    [
        ProducesResponseType(StatusCodes.Status200OK, Type = typeof(MaintenanceIssueDetail)),
        ProducesResponseType(StatusCodes.Status404NotFound),
        // Produces(ProducesMediaType)
    ]
    public async Task<IActionResult> GetDetail(string id, [FromServices]IMaintenanceIssueQueryProvider queryProvider)
    {
        var detail = await queryProvider.RehydrateAsJson(id);
        return string.IsNullOrEmpty(detail) ? NotFound() : Ok(detail);
    }
}

public interface IMaintenanceIssueQueryProvider: IQueryProvider<MaintenanceIssueDetail>;