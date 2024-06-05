using Cerverus.Core.Domain;
using Cerverus.Features.Features.Captures;
using Cerverus.Maintenance.Features.Features.Analysis;
using Cerverus.Maintenance.Features.Features.Shared;

namespace Cerverus.Maintenance.Features.Features.Issues;

public record CreateIssue(
    string MaintenanceProcessId,
    CaptureInfo CaptureInfo,
    CaptureError? CaptureError,
    List<FilterResult> Errors,
    string SentBy = "") : ICommand{
    internal static CreateIssue FromAnalysisFailure(string maintenanceProcessId, CaptureInfo captureInfo, List<FilterResult> results, string reviewer) =>
        new(maintenanceProcessId, captureInfo, null, results.Where(x => x.IsError).ToList(), reviewer);
    internal static CreateIssue FromCaptureError(string maintenanceProcessId, CaptureInfo captureInfo,
        CaptureError error) =>
        new(maintenanceProcessId, captureInfo, error, []);
}