using NodaTime;

namespace Cerberus.Maintenance.Features.Features.Analysis;

public record FilterResult(
    string FilterId,
    string FilterDescription,
    Instant At,
    Duration ElapsedTime,
    bool Result,
    byte[]? FilteredImageBuffer = null,
    string? ErrorMessage = null)
{
    public bool IsError => !Result;
    public bool IsSuccess => Result;
}

public static class FilterResultExtensions
{
    public static bool IsAnalysisSuccessful(this IEnumerable<FilterResult> results) => results.All(r => r.Result);
}

