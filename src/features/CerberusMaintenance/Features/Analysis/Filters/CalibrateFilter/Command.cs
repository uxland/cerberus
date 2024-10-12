using Cerberus.Core.Domain;

namespace Cerberus.Maintenance.Features.Features.Analysis.Filters.CalibrateFilter;

public record CalibrateResult(
    bool Success,
    string OriginalBase64Image,
    string? CalibratedBase64Image 
    );
public record CalibrateCameraFilter(string CameraId, string FilterId, int NumberOfCaptures, dynamic Args): ICommand<IList<CalibrateResult>>;
