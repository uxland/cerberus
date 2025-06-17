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
    // Definir una paleta de colores profesional
    private static readonly string PrimaryColor = "#1E3A8A";      // Azul corporativo
    private static readonly string SecondaryColor = "#3B82F6";    // Azul claro
    private static readonly string AccentColor = "#EFF6FF";       // Azul muy claro
    private static readonly string OrangeAccentColor = "#FFF7ED"; // Naranja muy claro para accent
    private static readonly string SuccessColor = "#059669";      // Verde profesional
    private static readonly string WarningColor = "#D97706";      // Naranja profesional
    private static readonly string DangerColor = "#DC2626";       // Rojo profesional
    private static readonly string NeutralGray = "#6B7280";       // Gris neutro
    private static readonly string LightGrayHex = "#F9FAFB";     // Gris muy claro
    private static readonly Color LightGray = Colors.Grey.Lighten5; // Gris muy claro como Color

    public void Compose(IDocumentContainer container)
    {
        container
            .Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(30);
                page.DefaultTextStyle(x => x.FontSize(10).FontColor(Colors.Grey.Darken2).FontFamily("Segoe UI"));

                page.Header().Element(ComposeHeader);
                page.Content().Element(ComposeContent);
                page.Footer().Element(ComposeFooter);
            });
    }

    private void ComposeHeader(IContainer container)
    {
        container.Column(column =>
        {
            // Logo y título principal
            column.Item().Row(row =>
            {
                row.ConstantItem(60).Container()
                    .Width(50)
                    .Height(50)
                    .Background(PrimaryColor)
                    .AlignCenter()
                    .AlignMiddle()
                    .Text("🛡️")
                    .FontSize(24)
                    .FontColor(Colors.White);

                row.ConstantItem(20);

                row.RelativeItem().Column(titleColumn =>
                {
                    titleColumn.Item().Text("CERBERUS")
                        .FontSize(18)
                        .Bold()
                        .FontColor(PrimaryColor);

                    titleColumn.Item().Text("INFORME DE VIGILANCIA Y SEGURIDAD")
                        .FontSize(14)
                        .Medium()
                        .FontColor(NeutralGray);
                        
                    titleColumn.Item().Height(5);
                    
                    titleColumn.Item().Text($"Ubicación: {run.RootLocationId}")
                        .FontSize(11)
                        .FontColor(Colors.Grey.Darken1);
                });

                row.ConstantItem(140).AlignRight().Column(metaColumn =>
                {
                    metaColumn.Item().Container()
                        .Border(1)
                        .BorderColor(Colors.Grey.Lighten1)
                        .Background(LightGray)
                        .Padding(8)
                        .Column(metaInfo =>
                        {
                            metaInfo.Item().Text("INFORMACIÓN DEL DOCUMENTO")
                                .FontSize(8)
                                .Bold()
                                .FontColor(NeutralGray);
                            
                            metaInfo.Item().Height(5);
                            
                            metaInfo.Item().Text($"Fecha de ejecución:")
                                .FontSize(8)
                                .FontColor(Colors.Grey.Darken1);
                            metaInfo.Item().Text(FormatInstant(run.StartedAt, "dd/MM/yyyy"))
                                .FontSize(9)
                                .Bold();
                            
                            metaInfo.Item().Height(3);
                            
                            metaInfo.Item().Text($"Generado el:")
                                .FontSize(8)
                                .FontColor(Colors.Grey.Darken1);
                            metaInfo.Item().Text($"{SystemClock.Instance.GetCurrentInstant():dd/MM/yyyy HH:mm}")
                                .FontSize(9)
                                .Bold();
                        });
                });
            });

            column.Item().Height(20);
            column.Item().Height(3).Background(PrimaryColor);
            column.Item().Height(15);
        });
    }

    private void ComposeContent(IContainer container)
    {
        container.Column(column =>
        {
            column.Item().Element(ComposeExecutiveSummary);
            
            column.Item().Height(25);
            foreach (var (inspection, index) in run.InspectionRuns.Select((insp, idx) => (insp, idx)))
            {
                //Saltos de página para separar secciones
                column.Item().PageBreak();
                column.Item().Element(c => ComposeInspectionDetail(c, inspection));
                column.Item().Height(20);
            }
        });
    }

    private void ComposeExecutiveSummary(IContainer container)
    {
        container.Column(column =>
        {
            // Título con línea decorativa
            column.Item().Row(row =>
            {
                row.ConstantItem(4).Height(20).Background(PrimaryColor);
                row.ConstantItem(15);
                row.RelativeItem().Text("RESUMEN EJECUTIVO")
                    .FontSize(16)
                    .Bold()
                    .FontColor(PrimaryColor);
            });

            column.Item().Height(20);

            // Cards con información mejorada
            column.Item().Row(row =>
            {
                row.RelativeItem().Element(ComposeBasicInfoCard);
                row.ConstantItem(20);
                row.RelativeItem().Element(ComposeStatsCard);
            });

            column.Item().Height(25);
            column.Item().Element(ComposeInspectionsSummary);
        });
    }

    private void ComposeBasicInfoCard(IContainer container)
    {
        container.Decoration(decoration =>
        {
            decoration.Before()
                .Background(AccentColor)
                .Height(6);
                
            decoration.Content()
                .Border(1)
                .BorderColor(Colors.Grey.Lighten1)
                .Background(Colors.White)
                .Height(190) // Altura fija para igualar ambos cards
                .Padding(20)
                .Column(column =>
        {
            column.Item().Row(row =>
            {
                row.ConstantItem(24).Container()
                    .Width(20)
                    .Height(20)
                    .Background(SecondaryColor)
                    .AlignCenter()
                    .AlignMiddle()
                    .Text("ℹ️")
                    .FontSize(12)
                    .FontColor(Colors.White);

                row.ConstantItem(10);
                
                row.RelativeItem().Text("INFORMACIÓN GENERAL")
                    .FontSize(12)
                    .Bold()
                    .FontColor(PrimaryColor);
            });

            column.Item().Height(15);

            var shortId = run.Id.Length > 12 ? run.Id.Substring(0, 12) + "..." : run.Id;
            
            AddInfoRow(column, "ID de Ejecución:", shortId);
            AddInfoRow(column, "Ubicación:", run.RootLocationId ?? "N/A");
            AddInfoRow(column, "Hora de Inicio:", FormatInstant(run.StartedAt, "dd/MM/yyyy HH:mm:ss"));
            AddInfoRow(column, "Hora de Finalización:", FormatInstant(run.EndedAt, "dd/MM/yyyy HH:mm:ss"));
            AddInfoRow(column, "Estado:", GetStatusInSpanish(run.Status.ToString()));
                    });
            });
        }

    private void ComposeStatsCard(IContainer container)
    {
        var totalInspections = run.InspectionRuns?.Count() ?? 0;
        var anomalousInspections = run.InspectionRuns?.Count(i => 
            i.OperationRun.Answers?.Any(a => a.Answer?.IsAnomalous == true) == true) ?? 0;
        var normalInspections = totalInspections - anomalousInspections;
        var successRate = totalInspections > 0 ? (normalInspections * 100.0 / totalInspections) : 0;

        container.Decoration(decoration =>
        {
            decoration.Before()
                .Background(OrangeAccentColor)
                .Height(6);
                
            decoration.Content()
                .Border(1)
                .BorderColor(Colors.Grey.Lighten1)
                .Background(Colors.White)
                .Height(190) // Misma altura fija que el card anterior
                .Padding(20)
                .Column(column =>
        {
            column.Item().Row(row =>
            {
                row.ConstantItem(24).Container()
                    .Width(20)
                    .Height(20)
                    .Background(anomalousInspections > 0 ? WarningColor : SuccessColor)
                    .AlignCenter()
                    .AlignMiddle()
                    .Text("📊")
                    .FontSize(12)
                    .FontColor(Colors.White);

                row.ConstantItem(10);
                
                row.RelativeItem().Text("ESTADÍSTICAS DE EJECUCIÓN")
                    .FontSize(12)
                    .Bold()
                    .FontColor(PrimaryColor);
            });

            column.Item().Height(15);

            AddInfoRow(column, "Total de Inspecciones:", totalInspections.ToString());
            AddInfoRow(column, "Inspecciones Exitosas:", $"{normalInspections} ({successRate:F1}%)");
            AddInfoRow(column, "Anomalías Detectadas:", anomalousInspections.ToString());
            AddInfoRow(column, "Tiempo Total de Ejecución:", CalculateDuration(run.StartedAt, run.EndedAt));
                });
        });
    }

    private void ComposeInspectionsSummary(IContainer container)
    {
        container.Column(column =>
        {
            column.Item().Row(row =>
            {
                row.ConstantItem(4).Height(20).Background(PrimaryColor);
                row.ConstantItem(15);
                row.RelativeItem().Text("DETALLE DE INSPECCIONES")
                    .FontSize(14)
                    .Bold()
                    .FontColor(PrimaryColor);
            });

            column.Item().Height(15);

            // Tabla con headers
            column.Item().Container()
                .Border(1)
                .BorderColor(Colors.Grey.Lighten1)
                .Column(tableColumn =>
                {
                    // Header
                    tableColumn.Item().Background(LightGray)
                        .Border(1)
                        .BorderColor(Colors.Grey.Lighten1)
                        .Padding(12)
                        .Row(headerRow =>
                        {
                            headerRow.ConstantItem(40).Text("#")
                                .FontSize(10)
                                .Bold()
                                .FontColor(NeutralGray);
                            
                            headerRow.RelativeItem(3).Text("CÁMARA")
                                .FontSize(10)
                                .Bold()
                                .FontColor(NeutralGray);
                            
                            headerRow.RelativeItem(2).Text("DURACIÓN")
                                .FontSize(10)
                                .Bold()
                                .FontColor(NeutralGray);
                            
                            headerRow.RelativeItem(2).Text("HORA")
                                .FontSize(10)
                                .Bold()
                                .FontColor(NeutralGray);
                            
                            headerRow.RelativeItem(2).Text("ESTADO")
                                .FontSize(10)
                                .Bold()
                                .FontColor(NeutralGray);
                        });

                    // Filas de datos
                    foreach (var (inspection, index) in run.InspectionRuns.Select((insp, idx) => (insp, idx)))
                    {
                        var hasAnomaly = inspection.OperationRun.Answers?.Any(a => a.Answer?.IsAnomalous == true) ?? false;
                        var anomalyCount = hasAnomaly ? inspection.OperationRun.Answers?.Count(a => a.Answer?.IsAnomalous == true) : 0;
                        var (statusColor, statusText, statusIcon) = hasAnomaly ? 
                            (anomalyCount > 1 ? (DangerColor, "Crítico", "🚨") : (WarningColor, "Advertencia", "⚠️")) : 
                            (SuccessColor, "Normal", "✅");

                        var bgColor = index % 2 == 0 ? Colors.White : LightGray;

                        tableColumn.Item().Background(bgColor)
                            .Border(1)
                            .BorderColor(Colors.Grey.Lighten2)
                            .Padding(12)
                            .Row(row =>
                            {
                                row.ConstantItem(40).Text($"{index + 1:00}")
                                    .FontSize(11)
                                    .Medium()
                                    .FontColor(PrimaryColor);

                                row.RelativeItem(3).Text(inspection.CameraDescription)
                                    .FontSize(10)
                                    .FontColor(Colors.Grey.Darken2);
                                
                                row.RelativeItem(2).Text(CalculateDuration(inspection.StartedAt, inspection.EndedAt))
                                    .FontSize(10)
                                    .FontColor(Colors.Grey.Darken1);
                                
                                row.RelativeItem(2).Text(FormatInstant(inspection.StartedAt, "HH:mm:ss"))
                                    .FontSize(10)
                                    .FontColor(Colors.Grey.Darken1);

                                row.RelativeItem(2).Container()
                                    .Background(statusColor)
                                    .PaddingVertical(4)
                                    .PaddingHorizontal(6)
                                    .AlignCenter()
                                    .Row(statusRow =>
                                    {
                                        statusRow.AutoItem().Text(statusIcon)
                                            .FontSize(8);
                                        statusRow.AutoItem().Text(" " + statusText)
                                            .FontSize(8)
                                            .FontColor(Colors.White)
                                            .Bold();
                                    });
                            });
                    }
                });
        });
    }

    private void ComposeInspectionDetail(IContainer container, InspectionRun inspection)
    {
        container.Column(column =>
        {
            // Título de sección con diseño mejorado
            column.Item().Container()
                .Background(PrimaryColor)
                .Padding(15)
                .Row(row =>
                {
                    row.AutoItem().Text("🎥")
                        .FontSize(16)
                        .FontColor(Colors.White);
                    
                    row.ConstantItem(10);
                    
                    row.RelativeItem().Text($"INSPECCIÓN DETALLADA - {inspection.CameraDescription}")
                        .FontSize(14)
                        .Bold()
                        .FontColor(Colors.White);
                });

            column.Item().Height(20);

            column.Item().Row(row =>
            {
                row.RelativeItem().Element(c => ComposeVideoInfo(c, inspection));
                row.ConstantItem(25);
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

                // column.Item().Container()
                //     .Height(100)
                //     .Background(Colors.Grey.Darken1)
                //     .Border(2)
                //     .BorderColor(Colors.Grey.Medium)
                //     .AlignCenter()
                //     .AlignMiddle()
                //     .Text("🎥 Video no disponible en PDF")
                //     .FontColor(Colors.White)
                //     .FontSize(10);

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
        container.Row(row =>
        {
            row.RelativeItem().Text($"© {DateTime.Now.Year} Cerberus Surveillance System")
                .FontSize(8)
                .FontColor(Colors.Grey.Medium);
                
            row.RelativeItem().AlignCenter().Text("DOCUMENTO CONFIDENCIAL")
                .FontSize(8)
                .Bold()
                .FontColor(NeutralGray);
                
            row.RelativeItem().AlignRight().Text(text =>
            {
                text.Span("Página ").FontSize(8).FontColor(Colors.Grey.Medium);
                text.CurrentPageNumber().FontSize(8).Bold();
                text.Span(" de ").FontSize(8).FontColor(Colors.Grey.Medium);
                text.TotalPages().FontSize(8).Bold();
            });
        });
    }

    // Helper methods mejorados
    private static void AddInfoRow(ColumnDescriptor column, string label, string value)
    {
        column.Item().Row(row =>
        {
            row.RelativeItem(2).Text(label)
                .FontSize(9)
                .Medium()
                .FontColor(NeutralGray);
            row.RelativeItem(3).Text(value)
                .FontSize(10)
                .Bold()
                .FontColor(Colors.Grey.Darken2);
        });
        column.Item().Height(8);
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
