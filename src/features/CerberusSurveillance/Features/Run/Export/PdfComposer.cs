using System.Globalization;
using Cerberus.Surveillance.Features.Features.Operation;
using NodaTime;
using NodaTime.Text;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace Cerberus.Surveillance.Features.Features.Run.Export;

public class SurveillanceRunPdfDocument(SurveillanceRun run) : IDocument
{
    public void Compose(IDocumentContainer container)
    {
        container
            .Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(20);
                page.DefaultTextStyle(x => x.FontSize(10).FontColor(Colors.Black));

                page.Header().Element(ComposeHeader);
                page.Content().Element(ComposeContent);
                page.Footer().Element(ComposeFooter);
            });
    }

    private void ComposeHeader(IContainer container)
    {
        container.Row(row =>
        {
            row.RelativeItem().Column(column =>
            {
                column.Item().Text("Surveillance Run Report")
                    .FontSize(20)
                    .Bold()
                    .FontColor(Colors.Blue.Darken3);

                column.Item().Text($"Round: {run.RoundId} - Location: {run.RootLocationId}")
                    .FontSize(12)
                    .FontColor(Colors.Grey.Darken2);
            });

            row.ConstantItem(120).AlignRight()
                .Text($"Generated: {SystemClock.Instance.GetCurrentInstant():yyyy-MM-dd HH:mm}")
                .FontSize(8)
                .FontColor(Colors.Grey.Medium);
        });
    }

    private void ComposeContent(IContainer container)
    {
        container.Column(column =>
        {
            // Summary Page (like left panel)
            column.Item().Element(ComposeSummarySection);

            column.Item().PageBreak();

            // Detail pages for each inspection
            foreach (var inspection in run.InspectionRuns)
            {
                column.Item().Element(c => ComposeInspectionDetail(c, inspection));
                column.Item().PageBreak();
            }
        });
    }

    private void ComposeSummarySection(IContainer container)
    {
        container.Column(column =>
        {
            // Title
            column.Item().Text("Run Summary")
                .FontSize(18)
                .Bold();

            column.Item().Height(20);

            // Summary Card (like RunDetailsCard)
            column.Item().Element(ComposeSummaryCard);

            column.Item().Height(20);

            // Inspections List (like RunInspectionsList)
            column.Item().Element(ComposeInspectionsList);
        });
    }

    private void ComposeSummaryCard(IContainer container)
    {
        container.Border(1)
            .BorderColor(Colors.Grey.Lighten1)
            .Background(Colors.Grey.Lighten4)
            .Padding(15)
            .Column(column =>
            {
                column.Item().Row(row =>
                {
                    row.RelativeItem().Text("ID:").Medium().FontColor(Colors.Grey.Darken1);
                    row.RelativeItem().AlignRight().Text(run.Id[..Math.Min(8, run.Id.Length)])
                        .SemiBold();
                });

                column.Item().Height(8);

                column.Item().Row(row =>
                {
                    row.RelativeItem().Text("Location:").Medium().FontColor(Colors.Grey.Darken1);
                    row.RelativeItem().AlignRight().Text(run.RootLocationId).SemiBold();
                });

                column.Item().Height(8);

                column.Item().Row(row =>
                {
                    row.RelativeItem().Text("Start:").Medium().FontColor(Colors.Grey.Darken1);
                    row.RelativeItem().AlignRight().Text(FormatInstant(run.StartedAt)).SemiBold();
                });

                column.Item().Height(8);

                column.Item().Row(row =>
                {
                    row.RelativeItem().Text("Status:").Medium().FontColor(Colors.Grey.Darken1);
                    row.RelativeItem().AlignRight().Text(run.Status.ToString()).SemiBold();
                });

                column.Item().Height(8);

                column.Item().Row(row =>
                {
                    row.RelativeItem().Text("Inspections:").Medium().FontColor(Colors.Grey.Darken1);
                    row.RelativeItem().AlignRight()
                        .Text($"{run.InspectionRuns?.Count() ?? 0}\u0020\u002f\u0020{run.InspectionRuns?.Count() ?? 0}").SemiBold();
                });
            });
    }

    private void ComposeInspectionsList(IContainer container)
    {
        container.Column(column =>
        {
            column.Item().Text("Run Inspections")
                .FontSize(16)
                .Bold();

            column.Item().Height(15);

            foreach (var inspection in run.InspectionRuns)
            {
                column.Item().Element(c => ComposeInspectionSummaryCard(c, inspection));
                column.Item().Height(10);
            }
        });
    }

    private void ComposeInspectionSummaryCard(IContainer container, InspectionRun inspection)
    {
        var hasAnomaly = inspection.OperationRun.Answers?.Any(a => a.Answer?.IsAnomalous == true) ?? false;
        var anomalyCount = hasAnomaly ? inspection.OperationRun.Answers?.Count(a => a.Answer?.IsAnomalous == true) : 0;
        var statusColor =
            hasAnomaly ? anomalyCount > 1 ? Colors.Red.Darken2 : Colors.Orange.Darken1 : Colors.Green.Darken1;
        var statusText = hasAnomaly ? anomalyCount > 1 ? "Multiple Anomalies" : "Single Anomaly" : "Normal";

        container.Border(1)
            .BorderColor(Colors.Grey.Lighten1)
            .Background(Colors.Grey.Lighten4)
            .Padding(10)
            .Row(row =>
            {
                row.RelativeItem().Column(column =>
                {
                    column.Item().Text(inspection.CameraDescription)
                        .SemiBold();
                    column.Item().Text(FormatInstant(inspection.StartedAt))
                        .FontSize(9)
                        .FontColor(Colors.Grey.Darken1);
                });

                row.ConstantItem(100).AlignRight().Container()
                    .Background(statusColor)
                    .Padding(4)
                    .Text(statusText)
                    .FontSize(8)
                    .FontColor(Colors.White)
                    .Bold();
            });
    }

    private void ComposeInspectionDetail(IContainer container, InspectionRun inspection)
    {
        container.Column(column =>
        {
            // Inspection Header
            column.Item().Text($"Inspection Detail - {inspection.CameraDescription}")
                .FontSize(18)
                .Bold();

            column.Item().Height(20);

            // Video Section (like RunVideoSection)
            column.Item().Element(c => ComposeVideoSection(c, inspection));

            column.Item().Height(20);

            // Form Section (like InspectionFormReadOnly)
            column.Item().Element(c => ComposeFormSection(c, inspection));
        });
    }

    private void ComposeVideoSection(IContainer container, InspectionRun inspection)
    {
        container.Border(1)
            .BorderColor(Colors.Grey.Lighten1)
            .Background(Colors.Grey.Lighten4)
            .Padding(15)
            .Column(column =>
            {
                column.Item().Text("Video Details")
                    .FontSize(14)
                    .Bold()
                    .FontColor(Colors.Blue.Darken2);

                column.Item().Height(10);

                column.Item().Container()
                    .Height(100)
                    .Background(Colors.Grey.Darken2)
                    .AlignCenter()
                    .AlignMiddle()
                    .Text("Video Preview Not Available in PDF")
                    .FontColor(Colors.White)
                    .FontSize(12);

                column.Item().Height(15);

                column.Item().Row(row =>
                {
                    row.RelativeItem().Text("Camera:").FontColor(Colors.Grey.Darken1);
                    row.RelativeItem().AlignRight().Text(inspection.CameraDescription).SemiBold();
                });

                column.Item().Height(8);

                column.Item().Row(row =>
                {
                    row.RelativeItem().Text("Duration:").FontColor(Colors.Grey.Darken1);
                    row.RelativeItem().AlignRight().Text(CalculateDuration(inspection.StartedAt, inspection.EndedAt))
                        .SemiBold();
                });

                column.Item().Height(8);

                column.Item().Row(row =>
                {
                    row.RelativeItem().Text("Date:").FontColor(Colors.Grey.Darken1);
                    row.RelativeItem().AlignRight().Text(FormatInstant(inspection.StartedAt)).SemiBold();
                });
            });
    }

    private void ComposeFormSection(IContainer container, InspectionRun inspection)
    {
        container.Border(1)
            .BorderColor(Colors.Grey.Lighten1)
            .Background(Colors.Grey.Lighten4)
            .Padding(15)
            .Column(column =>
            {
                column.Item().Text($"Operation: {inspection.OperationRun.Description}")
                    .FontSize(12)
                    .SemiBold()
                    .FontColor(Colors.Grey.Darken1);

                column.Item().Height(15);

                foreach (var answer in inspection.OperationRun.Answers)
                {
                    column.Item().Element(c => ComposeAnswerItem(c, answer));
                    column.Item().Height(10);
                }

                // Additional Comments
                if (string.IsNullOrEmpty(inspection.OperationRun?.AdditionalComments)) return;
                column.Item().Height(15);
                column.Item().Text("Additional Comments")
                    .SemiBold();
                column.Item().Height(5);
                column.Item().Border(1)
                    .BorderColor(Colors.Grey.Medium)
                    .Background(Colors.Grey.Lighten3)
                    .Padding(8)
                    .Text(inspection.OperationRun.AdditionalComments)
                    .FontSize(9);
            });
    }

    private void ComposeAnswerItem(IContainer container, OperationRunQuestionAnswer answer)
    {
        container.Column(column =>
        {
            // Question header with anomaly indicator
            column.Item().Row(row =>
            {
                row.RelativeItem().Text(GetQuestionText(answer.Question))
                    .FontSize(10)
                    .SemiBold();

                if (answer.Answer?.IsAnomalous == true)
                    row.ConstantItem(80).AlignRight().Container()
                        .Background(Colors.Red.Darken1)
                        .Padding(2)
                        .Text("ANOMALOUS")
                        .FontSize(7)
                        .FontColor(Colors.White)
                        .Bold();
            });

            column.Item().Height(5);

            // Answer value
            column.Item().Border(1)
                .BorderColor(Colors.Grey.Medium)
                .Background(Colors.Grey.Lighten3)
                .Padding(8)
                .Text(GetAnswerValue(answer.Answer))
                .FontSize(9);

            // Actions if any
            if (answer.Answer?.Actions?.Any() == true)
            {
                column.Item().Height(8);
                column.Item().Text("Actions")
                    .FontSize(9)
                    .SemiBold();

                foreach (var action in answer.Answer.Actions)
                    column.Item().Element(c => ComposeActionItem(c, action, 0));
            }
        });
    }

    private void ComposeActionItem(IContainer container, OperationActionExecution action, int level)
    {
        var leftMargin = level * 10;

        container.PaddingLeft(leftMargin).Column(column =>
        {
            column.Item().Border(1)
                .BorderColor(Colors.Grey.Medium)
                .Background(Colors.Grey.Lighten2)
                .Padding(8)
                .Column(actionColumn =>
                {
                    actionColumn.Item().Text($"{(level > 0 ? "- " : "")}{action.Action.Description}")
                        .FontSize(9);

                    actionColumn.Item().Height(5);

                    actionColumn.Item().Row(row =>
                    {
                        // Executed status
                        var executedColor = action.Executed ? Colors.Green.Darken1 : Colors.Red.Darken1;
                        var executedText = action.Executed ? "DONE" : "NOT DONE";

                        row.ConstantItem(60).Container()
                            .Background(executedColor)
                            .Padding(2)
                            .Text(executedText)
                            .FontSize(7)
                            .FontColor(Colors.White)
                            .Bold();

                        // Comments indicator
                        if (!string.IsNullOrEmpty(action.Comments))
                            row.ConstantItem(80).Container()
                                .Background(Colors.Blue.Darken1)
                                .Padding(2)
                                .Text("HAS COMMENTS")
                                .FontSize(7)
                                .FontColor(Colors.White);
                    });

                    // Comments if any
                    if (!string.IsNullOrEmpty(action.Comments))
                    {
                        actionColumn.Item().Height(5);
                        actionColumn.Item().Border(1)
                            .BorderColor(Colors.Grey.Darken1)
                            .Background(Colors.Grey.Lighten4)
                            .Padding(5)
                            .Text(action.Comments)
                            .FontSize(8);
                    }
                });

            // Alternatives (recursive)
            if (action.Alternatives.Count != 0 != true) return;
            foreach (var alternative in action.Alternatives)
            {
                column.Item().Height(5);
                column.Item().Element(c => ComposeActionItem(c, alternative, level + 1));
            }
        });
    }

    private void ComposeFooter(IContainer container)
    {
        container.AlignCenter().Text(text =>
        {
            text.CurrentPageNumber().FontSize(8);
            text.Span(" / ").FontSize(8);
            text.TotalPages().FontSize(8);
        });
    }

    // Helper methods to handle your domain models
    private static string GetQuestionText(IOperationQuestion question)
    {
        return question switch
        {
            OptionsQuestion opt => opt.Text,
            TextQuestion txt => txt.Text,
            IntegerQuestion integer => integer.Text,
            FloatQuestion floatQ => floatQ.Text,
            _ => "Unknown Question"
        };
    }

    private static string GetAnswerValue(IOperationAnswer? answer)
    {
        if (answer == null) return "No answer";

        return answer switch
        {
            TextAnswer text => text.Value,
            IntegerAnswer integer => integer.Value.ToString(),
            FloatAnswer floatA => floatA.Value.ToString("F2"),
            OptionAnswer option => string.Join(", ", option.Values.Select(v => v.Code)),
            _ => "Unknown answer type"
        };
    }

    private static string FormatInstant(Instant? instant)
    {
        if (instant == null) return "N/A";

        var pattern = InstantPattern.Create("dd MMM yyyy, HH:mm:ss", CultureInfo.InvariantCulture);
        return pattern.Format(instant.Value);
    }

    private static string CalculateDuration(Instant? start, Instant? end)
    {
        if (start == null || end == null) return "00:00";

        var duration = end.Value - start.Value;
        var totalSeconds = (int)duration.TotalSeconds;
        var minutes = totalSeconds / 60;
        var seconds = totalSeconds % 60;

        return $"{minutes:00}:{seconds:00}";
    }
}