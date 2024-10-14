using Cerberus.Core.Domain;
using Cerberus.Maintenance.Features.Features.Analysis.Filters;
using Cerberus.Maintenance.Features.Features.MaintenanceChecks;

namespace Cerberus.Maintenance.Features.Features.Settings.GetMaintenanceSettings;


public record GetMaintenanceSettings(string CameraId): ICommand<MaintenanceSettingsDetail>;

public class Handler(IMaintenanceSettingsProvider provider, IReadModelQueryProvider queryProvider)
{
    public  async Task<MaintenanceSettingsDetail> Handle(GetMaintenanceSettings query,  CancellationToken cancellationToken)
    {
        var (filters, settings) = await RetrieveData(query.CameraId);
        var details = new MaintenanceSettingsDetail(
            settings.MaintenanceMode,
            settings.AnalysisFiltersArgs.ToDictionary(kvp => kvp.Key,
                kvp => new AnalysisFiltersArgsDetail(filters[kvp.Key], kvp.Value))
        );
        return details;
    }


    private async Task<(IDictionary<string, string> Filters, MaintenanceSettings Settings)> RetrieveData(string cameraId)
    {
        var filtersTask = queryProvider.ProjectList<Filter, FilterDescription>(f => new FilterDescription( f.Id, f.Description ));
        var settings = await provider.GetCameraMaintenanceSettings(cameraId);
        var filers = await filtersTask;
        return new (filers.ToDictionary(f => f.Id, f => f.Description), settings);
    }
    private record FilterDescription(string Id, string Description);
}