using Cerberus.Core.Domain;

namespace Cerberus.Maintenance.Features.Features.Settings.SetFilterArgs;

public record SetCameraFilterArgs(string CameraId, string FilterId, dynamic? Args): ICommand;

public record CameraFilterArgsSet(string Id, string FilterId, dynamic Args): IDomainEvent;