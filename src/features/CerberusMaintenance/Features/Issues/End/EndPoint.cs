﻿using Cerberus.Maintenance.Features.Features.Issues.GetDetail;
using Cerberus.Maintenance.Features.Features.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Wolverine;

namespace Cerberus.Maintenance.Features.Features.Issues;

[ApiController]
[Route("api/maintenance-issues")]
public class EndPoint : ControllerBase
{
    public const string ConsumesMediaType = "application/json;domain-model=Cerberus.Maintenance.MaintenanceIssueDetail;version=1.0";
    [HttpPut("{id}/end")]
    [
        ProducesResponseType(StatusCodes.Status200OK, Type = typeof(MaintenanceIssueDetail)),
        ProducesResponseType(StatusCodes.Status404NotFound),
        // Produces(ProducesMediaType)
    ]
    [Authorize(Policy = MaintenancePolicies.Operations)]
    public async Task<IActionResult> End(string id, [FromBody]Payload payload, IMessageBus bus)
    {
        await bus.SendAsync(new EndMaintenanceIssue(id, Comment: payload.Comment));
        return Ok("Ended issue resolution.");
    }
    
    public record Payload(string? Comment);
}