using System.Dynamic;
using System.Text.Json;
using System.Text.Json.Nodes;
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
        return settings.Settings with { AnalysisFiltersArgs = filterArgs };
    }
    private MaintenanceSettings CreateDefaultSettings(IEnumerable<Filter> filters)
    {
        return new MaintenanceSettings(MaintenanceMode.Training, filters.ToDictionary(f => f.Id, f => f.DefaultArgs));
    }
    private async Task<(CameraMaintenanceSettings? CameraSettings, IReadOnlyList<Filter> Filters)> RetrieveSettingsAndFilters(string cameraId)
    {
        var filtersTask = queryProvider.List<Filter>();
        var settingsTask = queryProvider.Rehydrate<CameraMaintenanceSettings>(Utilities.GetCameraSettingsId(cameraId));
        
        await Task.WhenAll(settingsTask, filtersTask);
       return new ValueTuple<CameraMaintenanceSettings?, IReadOnlyList<Filter>>(settingsTask.Result, filtersTask.Result);
    }
    
    private static dynamic MergeDynamicObjects(dynamic? obj1, dynamic? obj2)
    {
        var doc1 = JsonDocument.Parse(obj1.GetRawText());
        var doc2 = JsonDocument.Parse(obj2.GetRawText());
        var mergedObject = new JsonObject();
        foreach (var property in doc1.RootElement.EnumerateObject())
            mergedObject.Add(property.Name, JsonNode.Parse(property.Value.GetRawText()));
        foreach (var property in doc2.RootElement.EnumerateObject())
            mergedObject[property.Name] = JsonNode.Parse(property.Value.GetRawText());
        using var mergedDoc = JsonDocument.Parse(mergedObject.ToString());
        return mergedDoc.RootElement.Clone();
        
    }
}