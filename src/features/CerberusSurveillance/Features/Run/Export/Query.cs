namespace Cerberus.Surveillance.Features.Features.Run.Export;

public record GetRunReport(string RunId, ExportFormat Format = ExportFormat.Pdf);