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
                page.Margin(25);
                page.DefaultTextStyle(x => x.FontSize(11).FontColor(Colors.Grey.Darken3));

                page.Header().Element(ComposeHeader);
                page.Content().Element(ComposeContent);
                page.Footer().Element(ComposeFooter);
            });
    }

    private void ComposeHeader(IContainer container)
    {
        container.Column(column =>
        {
            column.Item().Row(row =>
            {
                row.RelativeItem().Column(titleColumn =>
                {
                    titleColumn.Item().Text("REPORTE DE VIGILANCIA")
                        .FontSize(24)
                        .Bold()
                        .FontColor(Colors.Blue.Darken2);

                    titleColumn.Item().Text($"Ubicación: {run.RootLocationId}")
                        .FontSize(14)
                        .Medium()
                        .FontColor(Colors.Grey.Darken2);
                });

                row.ConstantItem(120).AlignRight().Column(dateColumn =>
                {
                    dateColumn.Item().Text($"Fecha: {FormatInstant(run.StartedAt, "dd/MM/yyyy")}")
                        .FontSize(10)
                        .FontColor(Colors.Grey.Darken1);
                    
                    dateColumn.Item().Text($"Generado: {SystemClock.Instance.GetCurrentInstant():dd/MM/yyyy HH:mm}")
                        .FontSize(9)
                        .FontColor(Colors.Grey.Medium);
                });
            });

            column.Item().Height(15);
            column.Item().Height(2).Background(Colors.Blue.Darken1);
            column.Item().Height(10);
        });
    }

    private void ComposeContent(IContainer container)
    {
        container.Column(column =>
        {
            column.Item().Element(ComposeExecutiveSummary);
            
            column.Item().Height(20);

            foreach (var inspection in run.InspectionRuns)
            {
                column.Item().Element(c => ComposeInspectionDetail(c, inspection));
                column.Item().Height(15);
            }
        });
    }

    private void ComposeExecutiveSummary(IContainer container)
    {
        container.Column(column =>
        {
            column.Item().Text("RESUMEN EJECUTIVO")
                .FontSize(18)
                .Bold()
                .FontColor(Colors.Blue.Darken2);

            column.Item().Height(2).Background(Colors.Blue.Darken2);
            column.Item().Height(15);

            column.Item().Row(row =>
            {
                row.RelativeItem().Element(ComposeBasicInfoCard);
                row.ConstantItem(15);
                row.RelativeItem().Element(ComposeStatsCard);
            });

            column.Item().Height(20);
            column.Item().Element(ComposeInspectionsSummary);
        });
    }

    private void ComposeBasicInfoCard(IContainer container)
    {
        container.Border(1)
            .BorderColor(Colors.Blue.Lighten2)
            .Background(Colors.Blue.Lighten4)
            .Padding(15)
            .Column(column =>
            {
                column.Item().Text("INFORMACIÓN GENERAL")
                    .FontSize(12)
                    .Bold()
                    .FontColor(Colors.Blue.Darken2);

                column.Item().Height(10);

                var shortId = run.Id.Length > 8 ? run.Id.Substring(0, 8) + "..." : run.Id;
                
                AddInfoRow(column, "ID:", shortId);
                AddInfoRow(column, "Ubicación:", run.RootLocationId ?? "N/A");
                AddInfoRow(column, "Inicio:", FormatInstant(run.StartedAt, "dd/MM/yyyy HH:mm"));
                AddInfoRow(column, "Finalización:", FormatInstant(run.EndedAt, "dd/MM/yyyy HH:mm"));
                AddInfoRow(column, "Estado:", GetStatusInSpanish(run.Status.ToString()));
            });
    }

    private void ComposeStatsCard(IContainer container)
    {
        var totalInspections = run.InspectionRuns?.Count() ?? 0;
        var anomalousInspections = run.InspectionRuns?.Count(i => 
            i.OperationRun.Answers?.Any(a => a.Answer?.IsAnomalous == true) == true) ?? 0;
        var normalInspections = totalInspections - anomalousInspections;

        container.Border(1)
            .BorderColor(Colors.Green.Lighten2)
            .Background(Colors.Green.Lighten4)
            .Padding(15)
            .Column(column =>
            {
                column.Item().Text("ESTADÍSTICAS")
                    .FontSize(12)
                    .Bold()
                    .FontColor(Colors.Green.Darken2);

                column.Item().Height(10);

                AddInfoRow(column, "Total Inspecciones:", totalInspections.ToString());
                AddInfoRow(column, "Inspecciones Normales:", normalInspections.ToString());
                AddInfoRow(column, "Con Anomalías:", anomalousInspections.ToString());
                AddInfoRow(column, "Duración Total:", CalculateDuration(run.StartedAt, run.EndedAt));
            });
    }

    private void ComposeInspectionsSummary(IContainer container)
    {
        container.Column(column =>
        {
            column.Item().Text("INSPECCIONES REALIZADAS")
                .FontSize(14)
                .Bold()
                .FontColor(Colors.Blue.Darken2);

            column.Item().Height(2).Background(Colors.Blue.Darken2);
            column.Item().Height(10);

            foreach (var (inspection, index) in run.InspectionRuns.Select((insp, idx) => (insp, idx)))
            {
                var hasAnomaly = inspection.OperationRun.Answers?.Any(a => a.Answer?.IsAnomalous == true) ?? false;
                var anomalyCount = hasAnomaly ? inspection.OperationRun.Answers?.Count(a => a.Answer?.IsAnomalous == true) : 0;
                var statusColor = hasAnomaly ? 
                    (anomalyCount > 1 ? Colors.Red.Darken1 : Colors.Orange.Darken1) : 
                    Colors.Green.Darken1;
                var statusText = hasAnomaly ? 
                    (anomalyCount > 1 ? "Múltiples Anomalías" : "Anomalía Detectada") : 
                    "Normal";

                column.Item().Border(1)
                    .BorderColor(Colors.Grey.Lighten1)
                    .Background(Colors.White)
                    .Padding(12)
                    .Row(row =>
                    {
                        row.ConstantItem(40).Text($"{index + 1}.")
                            .FontSize(12)
                            .Bold()
                            .FontColor(Colors.Blue.Darken2);

                        row.RelativeItem().Column(col =>
                        {
                            col.Item().Text(inspection.CameraDescription)
                                .FontSize(11)
                                .SemiBold();
                            
                            col.Item().Text($"Duración: {CalculateDuration(inspection.StartedAt, inspection.EndedAt)}")
                                .FontSize(9)
                                .FontColor(Colors.Grey.Darken1);
                            
                            col.Item().Text($"Hora: {FormatInstant(inspection.StartedAt, "HH:mm:ss")}")
                                .FontSize(9)
                                .FontColor(Colors.Grey.Darken1);
                        });

                        row.ConstantItem(120).AlignRight().Container()
                            .Background(statusColor)
                            .Padding(6)
                            .Text(statusText)
                            .FontSize(8)
                            .FontColor(Colors.White)
                            .Bold();
                    });
                
                column.Item().Height(8);
            }
        });
    }

    private void ComposeInspectionDetail(IContainer container, InspectionRun inspection)
    {
        container.Column(column =>
        {
            column.Item().Text($"INSPECCIÓN - {inspection.CameraDescription}")
                .FontSize(16)
                .Bold()
                .FontColor(Colors.Blue.Darken2);

            column.Item().Height(2).Background(Colors.Blue.Darken2);
            column.Item().Height(15);

            column.Item().Row(row =>
            {
                row.RelativeItem().Element(c => ComposeVideoInfo(c, inspection));
                row.ConstantItem(20);
                row.RelativeItem().Element(c => ComposeAnswersSection(c, inspection));
            });
        });
    }

    private void ComposeVideoInfo(IContainer container, InspectionRun inspection)
    {
        container.Border(1)
            .BorderColor(Colors.Blue.Lighten2)
            .Background(Colors.Blue.Lighten4)
            .Padding(15)
            .Column(column =>
            {
                column.Item().Text("INFORMACIÓN DEL VIDEO")
                    .FontSize(12)
                    .Bold()
                    .FontColor(Colors.Blue.Darken2);

                column.Item().Height(10);

                column.Item().Container()
                    .Height(100)
                    .Background(Colors.Grey.Darken1)
                    .Border(2)
                    .BorderColor(Colors.Grey.Medium)
                    .AlignCenter()
                    .AlignMiddle()
                    .Text("🎥 Video no disponible en PDF")
                    .FontColor(Colors.White)
                    .FontSize(10);

                column.Item().Height(15);

                column.Item().Border(1)
                    .BorderColor(Colors.Blue.Medium)
                    .Background(Colors.White)
                    .Padding(10)
                    .Column(detailsColumn =>
                    {
                        AddInfoRow(detailsColumn, "Cámara:", inspection.CameraDescription);
                        AddInfoRow(detailsColumn, "Duración:", CalculateDuration(inspection.StartedAt, inspection.EndedAt));
                        AddInfoRow(detailsColumn, "Inicio:", FormatInstant(inspection.StartedAt, "HH:mm:ss"));
                        AddInfoRow(detailsColumn, "Finalización:", FormatInstant(inspection.EndedAt, "HH:mm:ss"));
                    });
            });
    }

    private void ComposeAnswersSection(IContainer container, InspectionRun inspection)
    {
        container.Border(1)
            .BorderColor(Colors.Green.Lighten2)
            .Background(Colors.Green.Lighten4)
            .Padding(15)
            .Column(column =>
            {
                column.Item().Text("RESPUESTAS DE LA INSPECCIÓN")
                    .FontSize(12)
                    .Bold()
                    .FontColor(Colors.Green.Darken2);

                column.Item().Height(10);

                column.Item().Text($"Operación: {inspection.OperationRun.Description}")
                    .FontSize(10)
                    .SemiBold()
                    .FontColor(Colors.Grey.Darken2);

                column.Item().Height(2).Background(Colors.Grey.Darken2);
                column.Item().Height(10);

                foreach (var answer in inspection.OperationRun.Answers)
                {
                    column.Item().Element(c => ComposeQuestionAnswer(c, answer));
                    column.Item().Height(8);
                }

                if (!string.IsNullOrEmpty(inspection.OperationRun?.AdditionalComments))
                {
                    column.Item().Height(10);
                    column.Item().Text("Comentarios Adicionales:")
                        .FontSize(10)
                        .SemiBold()
                        .FontColor(Colors.Grey.Darken2);
                    
                    column.Item().Height(5);
                    
                    column.Item().Border(1)
                        .BorderColor(Colors.Grey.Medium)
                        .Background(Colors.White)
                        .Padding(8)
                        .Text(inspection.OperationRun.AdditionalComments)
                        .FontSize(9);
                }
            });
    }

    private void ComposeQuestionAnswer(IContainer container, OperationRunQuestionAnswer answer)
    {
        container.Column(column =>
        {
            column.Item().Row(row =>
            {
                row.RelativeItem().Text(GetQuestionText(answer.Question))
                    .FontSize(10)
                    .SemiBold()
                    .FontColor(Colors.Grey.Darken3);

                if (answer.Answer?.IsAnomalous == true)
                {
                    row.ConstantItem(70).AlignRight().Container()
                        .Background(Colors.Red.Darken1)
                        .Padding(3)
                        .Text("⚠️ ANOMALÍA")
                        .FontSize(7)
                        .FontColor(Colors.White)
                        .Bold();
                }
            });

            column.Item().Height(3);

            column.Item().Border(1)
                .BorderColor(answer.Answer?.IsAnomalous == true ? Colors.Red.Medium : Colors.Grey.Medium)
                .Background(Colors.White)
                .Padding(6)
                .Text(GetAnswerValue(answer.Answer))
                .FontSize(9);

            if (answer.Answer?.Actions?.Any() == true)
            {
                column.Item().Height(5);
                column.Item().Text("Acciones:")
                    .FontSize(9)
                    .SemiBold()
                    .FontColor(Colors.Grey.Darken2);

                foreach (var action in answer.Answer.Actions)
                {
                    column.Item().Element(c => ComposeActionItem(c, action, 0));
                }
            }
        });
    }

    private void ComposeActionItem(IContainer container, OperationActionExecution action, int level)
    {
        var leftMargin = level * 15;

        container.PaddingLeft(leftMargin).Column(column =>
        {
            column.Item().Height(3);
            column.Item().Border(1)
                .BorderColor(Colors.Grey.Medium)
                .Background(Colors.Grey.Lighten3)
                .Padding(8)
                .Column(actionColumn =>
                {
                    actionColumn.Item().Text($"{(level > 0 ? "↳ " : "• ")}{action.Action.Description}")
                        .FontSize(9)
                        .FontColor(Colors.Grey.Darken3);

                    actionColumn.Item().Height(5);

                    actionColumn.Item().Row(row =>
                    {
                        row.ConstantItem(60).Column(statusColumn =>
                        {
                            statusColumn.Item().Text("Estado:")
                                .FontSize(8)
                                .FontColor(Colors.Grey.Darken1);

                            var statusColor = action.Executed == true ? Colors.Green.Darken1 : Colors.Red.Darken1;
                            var statusText = action.Executed == true ? "✓ Ejecutado" : "✗ No ejecutado";

                            statusColumn.Item().Container()
                                .Height(16)
                                .Background(statusColor)
                                .Padding(2)
                                .AlignCenter()
                                .AlignMiddle()
                                .Text(statusText)
                                .FontSize(7)
                                .FontColor(Colors.White)
                                .Bold();
                        });

                        if (!string.IsNullOrEmpty(action.Comments))
                        {
                            row.ConstantItem(10);
                            row.RelativeItem().Column(commentColumn =>
                            {
                                commentColumn.Item().Text("Comentarios:")
                                    .FontSize(8)
                                    .FontColor(Colors.Grey.Darken1);
                                
                                commentColumn.Item().Text(action.Comments)
                                    .FontSize(8)
                                    .FontColor(Colors.Grey.Darken1);
                            });
                        }
                    });
                });

            if (action.Alternatives?.Any() == true)
            {
                foreach (var alternative in action.Alternatives)
                {
                    column.Item().Element(c => ComposeActionItem(c, alternative, level + 1));
                }
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

    // Helper methods
    private static void AddInfoRow(ColumnDescriptor column, string label, string value)
    {
        column.Item().Row(row =>
        {
            row.RelativeItem().Text(label).Medium().FontColor(Colors.Grey.Darken2);
            row.RelativeItem().AlignRight().Text(value).SemiBold();
        });
        column.Item().Height(5);
    }

    private static string GetQuestionText(IOperationQuestion question)
    {
        return question switch
        {
            OptionsQuestion opt => opt.Text,
            TextQuestion txt => txt.Text,
            IntegerQuestion integer => integer.Text,
            FloatQuestion floatQ => floatQ.Text,
            _ => "Pregunta desconocida"
        };
    }

    private static string GetAnswerValue(IOperationAnswer? answer)
    {
        if (answer == null) return "Sin respuesta";

        return answer switch
        {
            TextAnswer text => text.Value ?? "Sin respuesta",
            IntegerAnswer integer => integer.Value.ToString(),
            FloatAnswer floatA => floatA.Value.ToString("F2"),
            OptionAnswer option => string.Join(", ", option.Values?.Select(v => v.Code) ?? []),
            _ => "Tipo de respuesta desconocido"
        };
    }

    private static string GetStatusInSpanish(string status)
    {
        return status switch
        {
            "Released" => "Finalizado",
            "Completed" => "Completado",
            "InProgress" => "En Progreso",
            "Pending" => "Pendiente",
            "Failed" => "Fallido",
            _ => status
        };
    }

    private static string FormatInstant(Instant? instant, string format = "dd MMM yyyy, HH:mm:ss")
    {
        if (instant == null) return "N/A";

        var pattern = InstantPattern.Create(format, CultureInfo.InvariantCulture);
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
