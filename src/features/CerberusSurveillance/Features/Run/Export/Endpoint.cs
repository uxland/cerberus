using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;
using Wolverine;

namespace Cerberus.Surveillance.Features.Features.Run.Export;

internal static class Endpoint
{
    public static RouteGroupBuilder UseGetRunReport(this RouteGroupBuilder app)
    {
        app.MapGet("/{id}/report", async (string id, string? format, IMessageBus messageBus, ILogger<object> logger) =>
        {
            try
            {
                logger.LogInformation("Received report request for run {RunId} with format {Format}", id, format);
                
                var query = new GetRunReport(id, format.ParseFormat());
                var report = await messageBus.InvokeAsync<SurveillanceRunReport>(query);
                
                if (!report.Success) 
                {
                    logger.LogError("Report generation failed: {ErrorMessage}", report.ErrorMessage);
                    return Results.Problem(
                        detail: report.ErrorMessage,
                        statusCode: 500,
                        title: "PDF Generation Failed"
                    );
                }

                logger.LogInformation("Successfully generated report, returning file {FileName}", report.FileName);
                
                return Results.File(
                    fileContents: report.Content!,
                    contentType: report.ContentType!,
                    fileDownloadName: report.FileName!
                );
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Unexpected error in report endpoint for run {RunId}", id);
                return Results.Problem(
                    detail: ex.Message,
                    statusCode: 500,
                    title: "Internal Server Error"
                );
            }
        });
        return app;
    }
}