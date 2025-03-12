using Cerberus.Core.Domain;
using System.Collections.Generic;
using Cerberus.Surveillance.Features.Features.Round.CreateOrUpdate;

namespace Cerberus.Surveillance.Features.Features.Round.Create;

public record SurveillanceRoundCreated(
    string Id,
    RoundSettings Settings
) : IDomainEvent;

public record SurveillanceRoundUpdated(
    string Id,
    RoundSettings Settings
) : IDomainEvent;