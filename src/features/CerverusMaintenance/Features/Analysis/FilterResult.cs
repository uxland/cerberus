using NodaTime;

namespace Cerverus.Maintenance.Features.Features.Analysis;

public record FilterResult(string FilterId, string FilterDescription, ZonedDateTime At, Duration ElapsedTime,  bool Result, string? ErrorMessage = null);

public static class FilterResultExtensions
{
    public static bool IsAnalysisSuccessful(this IEnumerable<FilterResult> results) => results.All(r => r.Result);
}