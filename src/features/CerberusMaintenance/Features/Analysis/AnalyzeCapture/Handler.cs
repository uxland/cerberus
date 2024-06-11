﻿using Cerberus.Core.Domain;
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
       var results = await filterExecutor.ExecuteFilters(filters, capture.SnapshotPath);
       return new MaintenanceAnalysisPerformed(maintenanceProcessId, results);
    }
    
}

public interface IFiltersExecutor
{
    Task<List<FilterResult>> ExecuteFilters(IReadOnlyList<Filter> filters, string filePath);
}