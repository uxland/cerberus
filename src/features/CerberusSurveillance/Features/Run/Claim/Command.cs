using Cerberus.Core.Domain;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run.Claim;

public record ClaimRunResult(
    bool Success,
    string? Id,
    string? ErrorMessage = null
);
public record ClaimRun(string RunId, Instant At, User By): ICommand<ClaimRunResult>;