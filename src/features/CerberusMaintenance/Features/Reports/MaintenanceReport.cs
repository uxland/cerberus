using Cerberus.Core.Domain;
using NodaTime;

namespace Cerberus.Maintenance.Features.Features.Reports;

public partial class MaintenanceReport: AggregateRoot
{
    public required Instant CreatedAt { get; set; }
    public required string CameraId { get; set; }
    public required ConnectivityCheck ConnectivityCheck { get; set; }
    public required Dictionary<string, AnalysisCheck> AnalysisChecks { get; set; }
}

public enum ConnectivityErrorType
{
    None,
    AuthenticationError,
    ConnectionTimeout,
    CaptureError,
    UnknownError
}

public record ConnectivityCheck(
    bool Success,
    ConnectivityErrorType ErrorType,
    string? ErrorMessage = null
    );
public record AnalysisCheck(
    bool Success,
    string AnalysisId,
    bool ManualReview,
    string? ErrorMessage = null
    );