namespace Cerberus.Surveillance.Features.Features.Run.Export;

public enum ExportFormat
{
    Pdf
}

public static class FormatExtensions{

    public static ExportFormat ParseFormat(this string? format)
    {
        return ExportFormat.Pdf;
    }
}