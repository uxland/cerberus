
using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.Captures.ListCameraCaptures;

public record ListCameraCaptures(string CameraId, int? Take = null, int? Skip = null, params string[] OrderBy): IQuery<IReadOnlyList<Capture>>;
public record ListCameraCaptureSnaphsotPaths(string CameraId,  int? Take = null, int? Skip = null, params string[] OrderBy): IQuery<IReadOnlyList<string>>;
public record ListCameraCapturesAsJson(string CameraId, int? Take = null, int? Skip = null, params string[] OrderBy): IQuery<string>;