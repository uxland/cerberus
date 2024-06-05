using Cerverus.Core.Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cerverus.Features.Features.OrganizationalStructure.Location.GetLocationDetail;

[ApiController]
[Route("api/[controller]")]
public class LocationsController(IEntityQueryProvider<Location> entityQueryProvider): ControllerBase
{
    [HttpGet("{locationId}")]
    [
        ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Location)),
        ProducesResponseType(StatusCodes.Status404NotFound)
    ]
    public async Task<IActionResult> GetLocationDetail(string locationId)
    {
        var location = await entityQueryProvider.Rehydrate(locationId);
        return location == null ? NotFound() : Ok(location);
    }
}