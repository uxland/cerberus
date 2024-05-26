using Cerverus.Maintenance.Features.Features.MaintenanceChecks;

namespace Cerverus.Maintenance.Features.Features.Settings;

public record MaintenanceSettings(MaintenanceMode MaintenanceMode, List<string> AnalysisFilters);