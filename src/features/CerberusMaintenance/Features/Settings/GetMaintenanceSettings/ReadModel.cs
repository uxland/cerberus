using Cerberus.Maintenance.Features.Features.MaintenanceChecks;

namespace Cerberus.Maintenance.Features.Features.Settings.GetMaintenanceSettings;

public record AnalysisFiltersArgsDetail(string Description, dynamic Args);

public record MaintenanceSettingsDetail(
    MaintenanceMode? MaintenanceMode,
    Dictionary<string, AnalysisFiltersArgsDetail> AnalysisFiltersArgs);

