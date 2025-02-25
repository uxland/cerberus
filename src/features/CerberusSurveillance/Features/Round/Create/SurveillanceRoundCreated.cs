using Cerberus.Core.Domain;
using System.Collections.Generic;

namespace Cerberus.Surveillance.Features.Features.Round.Create;

public record SurveillanceRoundCreated(
    string Id,
    string RootLocationId, 
    string Description,
    string CronExpression,
    int? EstimatedDuration, 
    string? AssignedTo, 
    IEnumerable<Inspection> Inspections
) : IDomainEvent;