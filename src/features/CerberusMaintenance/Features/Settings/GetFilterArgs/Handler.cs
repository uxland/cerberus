using System.Text.Json;
using Cerberus.BackOffice.Features.OrganizationalStructure.Camera;
using Cerberus.Core.Domain;
using Cerberus.Core.Domain.Errors;
using Cerberus.Maintenance.Features.Features.Analysis.Filters;
using Cerberus.Maintenance.Features.Features.MaintenanceChecks;

namespace Cerberus.Maintenance.Features.Features.Settings.GetCameraFilterParameters;

public record GetCameraFilterParameters(string CameraId, string FilterId): ICommand<CameraFilterParameters>;
public static class Handler
{
    public static async Task<CameraFilterParameters> Handle(GetCameraFilterParameters query,
        IMaintenanceSettingsProvider provider, IReadModelQueryProvider queryProvider,
        CancellationToken cancellationToken)
    {
        var (settings, filterDescription, cameraDescription) = await RetrieveData(query, provider, queryProvider);
        var args = settings.AnalysisFiltersArgs.GetValueOrDefault(query.FilterId);
        if(args.ValueKind == JsonValueKind.Null)
            throw new EntityNotFoundException<Filter>(query.FilterId);
        return new CameraFilterParameters(cameraDescription, filterDescription, args);
}
    private static Task<(MaintenanceSettings Settings, string FilterDescription, string CameraDescription)> RetrieveData(
        GetCameraFilterParameters query, IMaintenanceSettingsProvider provider, IReadModelQueryProvider queryProvider
        )
    {
        var settingsTask = provider.GetCameraMaintenanceSettings(query.CameraId);
        var cameraTask = queryProvider.RehydrateOrFail<Camera>(query.CameraId);
        var filterTask = queryProvider.RehydrateOrFail<Filter>(query.FilterId);
        return Task.WhenAll(settingsTask, cameraTask, filterTask).ContinueWith(_ =>
        {
            var settings = settingsTask.Result;
            var camera = cameraTask.Result;
            var filter = filterTask.Result;
            return (settings, filter.Description, camera.Description);
        });
    }
}