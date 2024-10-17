using Cerberus.Core.Domain;
using Cerberus.Maintenance.Features.Features.MaintenanceChecks;

namespace Cerberus.Maintenance.Features.Features.Settings.Create;

public record CreateCameraSettings(string CameraId, MaintenanceMode? MaintenanceMode, Dictionary<string, dynamic?> AnalysisFiltersArgs): ICommand;

public record CameraSettingsCreated(string CameraId, MaintenanceSettings Settings): IDomainEvent;