using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cerverus.Maintenance.Features.Features.TrainingReviews.GetPendingReviews;

[ApiController]
[Route("api/maintenance/[controller]")]
public class LocationsController: ControllerBase
{
    public const string ProducesMediaType = "application/json;domain-model=Cerverus.Maintenance.PendingTrainingReviewList;version=1.0";

    [HttpGet("{path}")]
    [
        ProducesResponseType(StatusCodes.Status200OK, Type = typeof(List<PendingTrainingReview>)),
        ProducesResponseType(StatusCodes.Status404NotFound),
        Produces(ProducesMediaType)
    ]
    public async Task<IActionResult> GetPendingReviews(string path, [FromServices]IPendingTrainingReviewQueryProvider queryProvider)
    {
        var reviews = await queryProvider.ListByPathAsJson(path);
        return Ok(reviews);
    }
    
}