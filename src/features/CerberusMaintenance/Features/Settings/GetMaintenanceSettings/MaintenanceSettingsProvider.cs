using System.Dynamic;
using Cerberus.Core.Domain;
using Cerberus.Maintenance.Features.Features.Analysis.Filters;
using Cerberus.Maintenance.Features.Features.MaintenanceChecks;

namespace Cerberus.Maintenance.Features.Features.Settings.GetMaintenanceSettings;

public class MaintenanceSettingsProvider(IReadModelQueryProvider queryProvider) : IMaintenanceSettingsProvider
{
    public async Task<MaintenanceSettings> GetCameraMaintenanceSettings(string cameraId)
    {
       var (settings, filters) = await RetrieveSettingsAndFilters(cameraId);
       return settings != null ? CreateCameraSettings(settings, filters) : CreateDefaultSettings(filters);
    }
    
    private MaintenanceSettings CreateCameraSettings(CameraMaintenanceSettings settings, IEnumerable<Filter> filters)
    {
        var filterArgs = filters.ToDictionary(f => f.Id, f => MergeDynamicObjects(f.DefaultArgs, settings.Settings.AnalysisFiltersArgs.GetValueOrDefault(f.Id)));
        return new MaintenanceSettings(settings.Settings.MaintenanceMode, filterArgs);
    }
    private MaintenanceSettings CreateDefaultSettings(IEnumerable<Filter> filters)
    {
        return new MaintenanceSettings(MaintenanceMode.Training, filters.ToDictionary(f => f.Id, f => f.DefaultArgs));
    }
    private async Task<(CameraMaintenanceSettings? CameraSettings, IReadOnlyList<Filter> Filters)> RetrieveSettingsAndFilters(string cameraId)
    {
        var filtersTask = queryProvider.List<Filter>();
        var settingsTask = queryProvider.Rehydrate<CameraMaintenanceSettings>(cameraId);
        
        await Task.WhenAll(settingsTask, filtersTask);
       return new ValueTuple<CameraMaintenanceSettings?, IReadOnlyList<Filter>>(settingsTask.Result, filtersTask.Result);
    }
    
    private static dynamic MergeDynamicObjects(dynamic? obj1, dynamic? obj2)
    {
        var result = new ExpandoObject() as IDictionary<string, object>;
        if (obj1 != null)
        {
            foreach (var kvp in obj1)
                result.Add(kvp.Key, kvp.Value);
        }
        if(obj2 != null)
        {
            foreach (var kvp in obj2)
                result[kvp.Key] = kvp.Value;
        }
        return result;
    }
}