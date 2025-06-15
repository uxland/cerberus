
using Cerberus.Core.Domain;
using NodaTime;
using QuestPDF.Fluent;
using Microsoft.Extensions.Logging;

namespace Cerberus.Surveillance.Features.Features.Run.Export;

public static class Handler
{
    public static async Task<SurveillanceRunReport> Handle(GetRunReport query, IClock clock, IReadModelQueryProvider queryProvider, ILogger<object> logger)
    {
        logger.LogInformation("Starting PDF generation for run {RunId}", query.RunId);
        
        try
        {
            var run = await queryProvider.RehydrateOrFail<SurveillanceRun>(query.RunId);
            logger.LogInformation("Successfully retrieved run data for {RunId}", query.RunId);
            
            // Add QuestPDF license if needed
            QuestPDF.Settings.License = QuestPDF.Infrastructure.LicenseType.Community;
            
            var document = new SurveillanceRunPdfDocument(run);
            logger.LogInformation("Created PDF document instance for run {RunId}", query.RunId);
            
            // Generate PDF bytes with error handling
            byte[] pdfBytes;
            try
            {
                pdfBytes = document.GeneratePdf();
                logger.LogInformation("Successfully generated PDF bytes, size: {Size} bytes", pdfBytes?.Length ?? 0);
            }
            catch (Exception pdfEx)
            {
                logger.LogError(pdfEx, "Failed to generate PDF for run {RunId}", query.RunId);
                return new SurveillanceRunReport(
                    Success: false,
                    ErrorMessage: $"PDF generation failed: {pdfEx.Message}"
                );
            }

            if (pdfBytes == null || pdfBytes.Length == 0)
            {
                logger.LogError("Generated PDF is empty for run {RunId}", query.RunId);
                return new SurveillanceRunReport(
                    Success: false,
                    ErrorMessage: "Generated PDF is empty"
                );
            }

            // Validate PDF format
            if (pdfBytes.Length < 4 || 
                pdfBytes[0] != 0x25 || pdfBytes[1] != 0x50 || 
                pdfBytes[2] != 0x44 || pdfBytes[3] != 0x46)
            {
                logger.LogError("Generated content is not a valid PDF for run {RunId}", query.RunId);
                return new SurveillanceRunReport(
                    Success: false,
                    ErrorMessage: "Generated content is not a valid PDF"
                );
            }

            // Create filename
            var fileName = $"surveillance-run-{query.RunId[..8]}-{SystemClock.Instance.GetCurrentInstant():yyyy-MM-dd-HHmm}.pdf";
            logger.LogInformation("Generated filename: {FileName}", fileName);

            // DEBUG: Save to temp file for verification
            await SavePdfToTemp(pdfBytes, fileName, query.RunId, logger);

            logger.LogInformation("Successfully completed PDF generation for run {RunId}", query.RunId);
            return new SurveillanceRunReport(
                Success: true,
                Content: pdfBytes,
                FileName: fileName,
                ContentType: "application/pdf"
            );
        }
        catch (Exception e)
        {
            logger.LogError(e, "Unexpected error during PDF generation for run {RunId}", query.RunId);
            return new SurveillanceRunReport(
                Success: false,
                ErrorMessage: $"Error generating PDF: {e.Message}"
            );
        }
    }

    private static async Task SavePdfToTemp(byte[] pdfBytes, string fileName, string runId, ILogger logger)
    {
        try
        {
            var tempDir = Path.GetTempPath();
            var timestamp = DateTime.Now.ToString("yyyyMMdd_HHmmss");
            var debugFileName = $"DEBUG_{timestamp}_{fileName}";
            var filePath = Path.Combine(tempDir, debugFileName);

            await File.WriteAllBytesAsync(filePath, pdfBytes);
            
            logger.LogInformation("=== PDF DEBUG INFO ===");
            logger.LogInformation("Run ID: {RunId}", runId);
            logger.LogInformation("Debug file saved to: {FilePath}", filePath);
            logger.LogInformation("PDF size: {Size} bytes", pdfBytes.Length);
            logger.LogInformation("PDF header valid: {IsValid}", IsValidPdfHeader(pdfBytes));
            logger.LogInformation("File exists on disk: {Exists}", File.Exists(filePath));
            
            if (File.Exists(filePath))
            {
                var fileInfo = new FileInfo(filePath);
                logger.LogInformation("File size on disk: {DiskSize} bytes", fileInfo.Length);
            }
            logger.LogInformation("======================");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to save debug PDF file");
        }
    }

    private static bool IsValidPdfHeader(byte[] pdfBytes)
    {
        return pdfBytes.Length >= 4 && 
               pdfBytes[0] == 0x25 && // %
               pdfBytes[1] == 0x50 && // P
               pdfBytes[2] != 0x44 && // D
               pdfBytes[3] == 0x46;   // F
    }
}