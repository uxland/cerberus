using System.Linq.Expressions;
using Cerverus.Core.Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cerverus.Maintenance.Features.Features.Issues.ListByLocationPath;

[ApiController]
[Route("api/[controller]")]
public class LocationsController : ControllerBase
{
    public const string ProducesMediaType = "application/json;domain-model=Cerverus.Maintenance.MaintenanceIssueSummaryList;version=1.0";
    [HttpGet("{locationPath}/maintenance-issues")]
    [
        ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<PendingMaintenanceIssueSummary>)),
        ProducesResponseType(StatusCodes.Status404NotFound),
        // Produces(ProducesMediaType)
    ]
    public async Task<IActionResult> ListByLocationPath(string locationPath, [FromServices]IReadModelQueryProvider entityQueryProvider)
    {
        var spec =  new IssueInLocationSpec(locationPath) & (new IssueStatusSpec(MaintenanceIssueStatus.Open));
        var detail = await entityQueryProvider.ListAsJson(spec);
        return string.IsNullOrEmpty(detail) ? NotFound() : Ok(detail);
    }
}