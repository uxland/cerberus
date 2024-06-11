using Cerberus.BackOffice.Features.Captures;
using Cerberus.Core.Domain;

namespace Cerberus.Maintenance.Features.Features.Analysis.AnalyzeCapture;

public record AnalyzeCapture(string MaintenanceProcessId, Capture Capture): ICommand;