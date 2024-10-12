using System.Collections.Concurrent;
using Cerberus.BackOffice.Features.Captures.ListCameraCaptures;
using Cerberus.BackOffice.Features.Captures.RetrieveImage;
using Cerberus.Core.Domain;
using Cerberus.Core.Domain.Errors;
using Cerberus.Maintenance.Features.Features.Analysis.AnalyzeCapture;
using Wolverine;

namespace Cerberus.Maintenance.Features.Features.Analysis.Filters.CalibrateFilter;

public static class Handler
{
    public static async Task<IList<CalibrateResult>> Handle(CalibrateCameraFilter command, IFiltersExecutor filtersExecutor, IMessageBus bus, IReadModelQueryProvider queryProvider)
    {
        var (snapshotPaths, filter) = await RetrieveData(command, queryProvider, bus);
        var results = new ConcurrentBag<CalibrateResult>();
        await Parallel.ForEachAsync(snapshotPaths, async (snapshotPath, token) =>
        { 
            var args = new MaintenanceAnalysisArgs(filter, command.Args, AnalysisMode.Calibration, snapshotPath);
            var executionResult = (await filtersExecutor.ExecuteFilters([args])).First();
            var transformedImage = executionResult.FilteredImageBuffer != null ?  $"data:image/jpeg;base64,{Convert.ToBase64String(executionResult.FilteredImageBuffer)}" : null;
            var originalImage = await bus.InvokeAsync<string>(new RetrieveImageAsBase64(snapshotPath));
            results.Add(new CalibrateResult(executionResult.Result, originalImage, transformedImage));
        });
        return results.ToList();
    }
    
    private static async Task<(IEnumerable<string> SnapshotPaths, Filter Filter)>RetrieveData(CalibrateCameraFilter command, IReadModelQueryProvider queryProvider, IMessageBus bus)
    {
        var snapshotPathsTask = GetSnapshotPaths(command.CameraId, command.NumberOfCaptures, bus);
        var filter = await queryProvider.RehydrateOrFail<Filter>(command.FilterId);
        var snapshotPaths = await snapshotPathsTask;
        if(!snapshotPaths.Any())
            throw new BusinessException("No snapshots found for the camera ${command.CameraId}");
        return new (snapshotPaths, filter);
    }
    
    private static Task<IReadOnlyList<string>> GetSnapshotPaths(string cameraId, int take, IMessageBus bus)
    {
        var query = new ListCameraCaptureSnaphsotPaths(cameraId, Take: take, OrderBy: "at|desc");
        return bus.InvokeAsync<IReadOnlyList<string>>(query);
    }
}