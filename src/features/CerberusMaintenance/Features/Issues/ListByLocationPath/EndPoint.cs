using Cerberus.Core.Domain;
using Cerberus.Maintenance.Features.Features.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cerberus.Maintenance.Features.Features.Issues.ListByLocationPath;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = MaintenancePolicies.User)]
public class LocationsController : ControllerBase
{
    public const string ProducesMediaType = "application/json;domain-model=Cerberus.Maintenance.MaintenanceIssueSummaryList;version=1.0";
    [HttpGet("{locationPath}/maintenance-issues")]
    [
        ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<PendingMaintenanceIssueSummary>)),
        ProducesResponseType(StatusCodes.Status404NotFound),
        Produces("application/json")
    ]
    public async Task<IActionResult> ListByLocationPath(string locationPath, [FromServices]IReadModelQueryProvider entityQueryProvider)
    {
        var spec =  new IssueInLocationSpec(locationPath) & (new IssueStatusSpec(MaintenanceIssueStatus.Open) | new IssueStatusSpec(MaintenanceIssueStatus.InCourse));
        var detail = await entityQueryProvider.ListAsJson(spec);
        return string.IsNullOrEmpty(detail) ? NotFound() : Ok(detail);
    }
}