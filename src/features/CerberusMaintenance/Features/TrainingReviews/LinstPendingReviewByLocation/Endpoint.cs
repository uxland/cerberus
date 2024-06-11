using Cerberus.Core.Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cerberus.Maintenance.Features.Features.TrainingReviews.LinstPendingReviewByLocation;

[ApiController]
[Route("api/[controller]")]
public class LocationsController: ControllerBase
{
    public const string ProducesMediaType = "application/json;domain-model=Cerverus.Maintenance.PendingTrainingReviewList;version=1.0";

    [HttpGet("{path}/pending-reviews")]
    [
        ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<PendingTrainingReview>)),
        ProducesResponseType(StatusCodes.Status404NotFound),
       // Produces(ProducesMediaType)
    ]
    public async Task<IActionResult> ListPendingReviewByLocation(string path, [FromServices]IReadModelQueryProvider readModelQueryProvider)
    {
        var reviews = await readModelQueryProvider.ListAsJson(new ReviewInLocationSpec(path));
        return Ok(reviews);
    }
    
}