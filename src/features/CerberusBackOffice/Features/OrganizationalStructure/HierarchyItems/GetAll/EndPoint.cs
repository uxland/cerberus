using Cerberus.Core.Domain;
using Cerberus.MvcUtilities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.HierarchyItems.GetAll;

[ApiController]
[Route("api/[controller]")]
public class LocationsController(IReadModelQueryProvider queryProvider): ControllerBase
{
    internal const string ProducesMediaType = "application/json;domain-model=Cerberus.HierarchyItemList;version1.0.0";
    [HttpGet]
    [
        ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<HierarchyItem>)),
    ]
    [Authorize]
    public async Task<IEnumerable<HierarchyItem>> GetAll()
    {
        var result = await queryProvider.List<HierarchyItem>();
        return result;
    }
    
}