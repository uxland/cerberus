using Cerverus.Core.Domain;
using Cerverus.Features.Features.Captures;

namespace Cerverus.Maintenance.Features.Features.Analysis.AnalyzeCapture;

public record AnalyzeCapture(string MaintenanceProcessId, Capture Capture): ICommand;