
using Cerberus.Core.Domain;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run.Create;

public record CreateRun(string RoundId, Instant? PlannedAt = null ): ICommand<string>;