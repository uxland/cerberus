using Cerverus.Maintenance.Features.Features.MaintenanceChecks;

namespace Cerverus.Maintenance.Features.Features.Analysis.AnalyzeCapture;

public static class Handler
{
    public static async Task<MaintenanceAnalysisPerformed> Handle(AnalyzeCapture command, IMaintenanceSettingsProvider settingsProvider, IFiltersExecutor filterExecutor)
    {  
       var (maintenanceProcessId, capture) = command;
       var settings = await settingsProvider.GetCameraMaintenanceSettings(capture.CameraId);
       var results = await filterExecutor.ExecuteFilters(settings.AnalysisFilters, capture.SnapshotPath);
       return new MaintenanceAnalysisPerformed(maintenanceProcessId, results);
    }
    
}

public interface IFiltersExecutor
{
    Task<List<FilterResult>> ExecuteFilters(List<string> filters, string filePath);
}