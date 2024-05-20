using Cerverus.Core.Domain;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.MaintenanceShots;


public record CreateMaintenanceShot(Instant Timestamp, string CaptureId, string CameraId, string? ConnectionError, List<MaintenanceAnalysisResult> Results);

public record MaintenanceShotCreated(
    Instant Timestamp,
    string CaptureId,
    string CameraId,
    string? ConnectionError,
    List<MaintenanceAnalysisResult> Results) : IDomainEvent;

public partial class MaintenanceShot
:IDomainEventHandler<MaintenanceShotCreated>
{
    public MaintenanceShot(CreateMaintenanceShot command): this()
    {
        this.ApplyUncommittedEvent(
            new MaintenanceShotCreated(
                command.Timestamp,
                command.CaptureId,
                command.CameraId,
                command.ConnectionError,
                command.Results
                )
            );
    }

    public void Apply(MaintenanceShotCreated @event)
    {
        this.Id = Guid.NewGuid().ToString();
        this.Timestamp = @event.Timestamp;
        this.CaptureId = @event.CaptureId;
        this.CameraId = @event.CameraId;
        this.ConnectionError = @event.ConnectionError;
        this.AnalysisResults = @event.Results;
    }
}