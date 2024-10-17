using Cerberus.Maintenance.Features.Features.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace Cerberus.Maintenance.Features.Features.TrainingReviews;

[ApiController]
[Route("api/training-reviews")]
[Authorize(Policy = MaintenancePolicies.Operations)]
public class TrainingReviewsController(IMessageBus bus): ControllerBase
{
    public const string Consumes = "application/json;domain-model=Cerberus.Maintenance.FullfilTrainingReview;version=1.0";

    [HttpPut("{id}")]
    [
        //Consumes(Consumes),
        ProducesResponseType(StatusCodes.Status204NoContent),
        ProducesResponseType(StatusCodes.Status404NotFound),
        ProducesResponseType(StatusCodes.Status400BadRequest),
    ]
    public async Task<IActionResult> GetTrainingReview(string id, [FromBody]Dictionary<string, FilterResultReview> review)
    {
        await bus.SendAsync(new FulfillTrainingReview(id, review));
        return NoContent();       
    }
}