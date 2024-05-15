using Cerverus.Core.Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cerverus.Features.Features.OrganizationalStructure.Location.GetLocationDetail;

[ApiController]
[Route("api/[controller]")]
public class LocationsController(IQueryProvider<Location> queryProvider): ControllerBase
{
    [HttpGet("{locationId}")]
    [
        ProducesResponseType(StatusCodes.Status200OK),
        ProducesResponseType(StatusCodes.Status404NotFound)
    ]
    public Task<Location?> GetLocationDetail(string locationId)
    {
        return queryProvider.Rehydrate(locationId);
    }
}