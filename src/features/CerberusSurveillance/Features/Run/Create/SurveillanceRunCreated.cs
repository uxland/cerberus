using Cerberus.Core.Domain;
using System.Collections.Generic;

namespace Cerberus.Surveillance.Features.Features.Run.Create;

public record SurveillanceRunCreated(
    string Id,
    string RoundId,
) : IDomainEvent;