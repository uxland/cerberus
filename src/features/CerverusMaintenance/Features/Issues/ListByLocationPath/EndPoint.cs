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
        ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<MaintenanceIssueSummary>)),
        ProducesResponseType(StatusCodes.Status404NotFound),
        // Produces(ProducesMediaType)
    ]
    public async Task<IActionResult> ListByLocationPath(string locationPath, [FromServices]IMaintenanceIssueSummaryQueryProvider queryProvider)
    {
        var detail = await queryProvider.ListByLocationPathAsJson(locationPath);
        return string.IsNullOrEmpty(detail) ? NotFound() : Ok(detail);
    }
}

public interface IMaintenanceIssueSummaryQueryProvider : IQueryProvider<MaintenanceIssueSummary>
{
    public Task<string> ListByLocationPathAsJson(string locationPath);
    
}