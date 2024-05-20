using Cerverus.Core.Domain;

namespace Cerverus.Maintenance.Features.Features.MaintenanceShots.ProduceMaintenanceShot;

public record class ProduceMaintenanceShot(
    string CameraShotId,
    string CameraId,
    string SnapshotPath
    ): ICommand;