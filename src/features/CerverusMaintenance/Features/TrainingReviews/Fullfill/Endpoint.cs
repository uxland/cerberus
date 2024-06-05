using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace Cerverus.Maintenance.Features.Features.TrainingReviews.Fullfill;

[ApiController]
[Route("api/training-reviews")]
public class TrainingReviewsController(IMessageBus bus): ControllerBase
{
    public const string Consumes = "application/json;domain-model=Cerverus.Maintenance.FullfilTrainingReview;version=1.0";

    [HttpPut("{id}")]
    [
        //Consumes(Consumes),
        ProducesResponseType(StatusCodes.Status204NoContent),
        ProducesResponseType(StatusCodes.Status404NotFound),
        ProducesResponseType(StatusCodes.Status400BadRequest),
    ]
    public async Task<IActionResult> GetTrainingReview(string id, [FromBody]Dictionary<string, bool> review)
    {
        await bus.SendAsync(new FulfillTrainingReview(id, review.ToDictionary(x => x.Key, x => new FilterResultReview(x.Value))));
        return NoContent();       
    }
}