using Cerverus.Core.Domain;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.MaintenanceChecks;

public partial class MaintenanceCheck(): AggregateRoot
{
    public Instant Timestamp { get; set; }
    public string CaptureId { get; set; }
    public string CameraId { get; set; }
    public string? ConnectionError { get; set; }
    public List<MaintenanceAnalysisResult> AnalysisResults { get; set; } = new();
}

public record MaintenanceAnalysisResult(string FilterId, bool Success): ICommand;