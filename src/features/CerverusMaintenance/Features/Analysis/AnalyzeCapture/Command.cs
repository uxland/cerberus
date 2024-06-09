using Cerverus.BackOffice.Features.Captures;
using Cerverus.Core.Domain;

namespace Cerverus.Maintenance.Features.Features.Analysis.AnalyzeCapture;

public record AnalyzeCapture(string MaintenanceProcessId, Capture Capture): ICommand;