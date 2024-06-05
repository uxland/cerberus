using NodaTime;

namespace Cerverus.Maintenance.Features.Features.Analysis;

public record FilterResult(
    string FilterId,
    string FilterDescription,
    Instant At,
    Duration ElapsedTime,
    bool Result,
    string? ErrorMessage = null)
{
    public bool IsError => !Result;
    public bool IsSuccess => Result;
}

public static class FilterResultExtensions
{
    public static bool IsAnalysisSuccessful(this IEnumerable<FilterResult> results) => results.All(r => r.Result);
}

