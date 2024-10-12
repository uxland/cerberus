using Cerberus.Maintenance.Features.Features.MaintenanceChecks;

namespace Cerberus.Maintenance.Features.Features.Settings;

public record MaintenanceSettings(MaintenanceMode? MaintenanceMode, Dictionary<string, dynamic?> AnalysisFiltersArgs);