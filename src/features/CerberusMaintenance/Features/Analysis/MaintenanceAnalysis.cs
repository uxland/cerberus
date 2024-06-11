namespace Cerberus.Maintenance.Features.Features.Analysis;


public record MaintenanceAnalysisPerformed(string MaintenanceProcessId, List<FilterResult> FilterResults);