namespace Cerberus.Surveillance.Features.Features.Run.Export;

public record SurveillanceRunReport(
    bool Success,
    byte[]? Content = null,
    string? FileName = null,
    string? ContentType = null,
    string? ErrorMessage = null
    );