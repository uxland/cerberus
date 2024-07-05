using Cerberus.Core.Domain;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Cerberus.Maintenance.Features.Features.TrainingReviews.GetTrainingReview;

[ApiController]
[Route("api/training-reviews")]
[Produces("application/json")]
public class TrainingReviewsController: ControllerBase
{
    public const string ProducesMediaType = "application/json;domain-model=Cerberus.Maintenance.TrainingReviewDetail;version=1.0";

    [HttpGet("{id}")]
    [
        ProducesResponseType(StatusCodes.Status200OK, Type = typeof(TrainingReviewDetail)),
        ProducesResponseType(StatusCodes.Status404NotFound),
        // Produces(ProducesMediaType)
    ]
    public async Task<IActionResult> GetTrainingReview(string id, [FromServices]IReadModelQueryProvider readModelQueryProvider)
    {
        var review = await readModelQueryProvider.RehydrateAsJson<TrainingReviewDetail>(id);
        return string.IsNullOrEmpty(review) ? NotFound() : Ok(review);
    }
}