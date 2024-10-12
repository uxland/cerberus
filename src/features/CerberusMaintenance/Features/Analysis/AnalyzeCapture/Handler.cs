using Cerberus.Core.Domain;
using Cerberus.Maintenance.Features.Features.Analysis.Filters;
using Cerberus.Maintenance.Features.Features.MaintenanceChecks;

namespace Cerberus.Maintenance.Features.Features.Analysis.AnalyzeCapture;

public static class Handler
{
    public static async Task<MaintenanceAnalysisPerformed> Handle(AnalyzeCapture command, IMaintenanceSettingsProvider settingsProvider, IFiltersExecutor filterExecutor, IReadModelQueryProvider queryProvider)
    {  
       var (maintenanceProcessId, capture) = command;
       var settings = await settingsProvider.GetCameraMaintenanceSettings(capture.CameraId);
       var filters = await queryProvider.List<Filter>();
       var results = await filterExecutor.ExecuteFilters(filters.Select(x => new MaintenanceAnalysisArgs(x, settings.AnalysisFiltersArgs.GetValueOrDefault(x.Id), AnalysisMode.Production, capture.SnapshotPath!)).ToList());
       return new MaintenanceAnalysisPerformed(maintenanceProcessId, results);
    }
    
}

public record MaintenanceAnalysisArgs( Filter Filter, dynamic? Args, AnalysisMode Mode, string FilePath);

public interface IFiltersExecutor
{
    Task<List<FilterResult>> ExecuteFilters(IReadOnlyList<MaintenanceAnalysisArgs> args);
}