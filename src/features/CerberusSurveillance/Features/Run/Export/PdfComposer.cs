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
    private static readonly string PrimaryColor = "#ffc200";      // Amarillo / Naranja cerberus
    private static readonly string DarkBlue = "#1E3A8A"; // Azul Oscuro
    private static readonly string LightBlue = "#F7F8F8";       // Azul muy claro
    private static readonly string OrangeAccentColor = "#FFF7ED"; // Naranja muy claro para accent
    private static readonly string SuccessColor = "#00ae7a";      // Verde 
    private static readonly string WarningColor = "#EFA55D";      // Naranja 
    private static readonly string DangerColor = "#E2756E";       // Rojo 
    private static readonly string NeutralGray = "#6B7280";       // Gris neutro
    private static readonly string SuperLightGray = "#E0E3E3";     // Gris muy claro
    private static readonly Color LightGray = Colors.Grey.Lighten5; // Gris muy claro como Color

    // SVG de información con color PrimaryColor
    private static readonly string InfoSvg = """
        <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512">
            <path fill="#F5BA00" d="M256 0c70.689 0 134.692 28.656 181.02 74.98C483.344 121.308 512 185.311 512 256c0 70.689-28.656 134.692-74.98 181.016C390.692 483.344 326.689 512 256 512c-70.689 0-134.692-28.656-181.016-74.984C28.656 390.692 0 326.689 0 256S28.656 121.308 74.984 74.98C121.308 28.656 185.311 0 256 0zm-8.393 139.828c5.039-12.2 17.404-20.536 30.609-20.536 18.611 0 32.717 15.259 32.717 33.478 0 4.53-.796 8.776-2.407 12.704-6.902 16.91-26.09 25.405-43.082 18.302-16.871-7.122-24.821-27.096-17.837-43.948zm12.103 206.605c-.833 2.984-2.256 7.946-.674 10.725 4.22 7.45 16.459-6.058 19.036-8.97 8.307-9.414 15.461-20.475 21.905-31.229a1.506 1.506 0 012.061-.523l13.44 9.972c.641.473.789 1.363.367 2.03-6.18 10.743-12.426 20.124-18.744 28.129-10.452 13.234-23.595 25.852-39.583 32.065-9.918 3.842-22.817 5.363-34.144 2.829-10.506-2.353-19.66-8.206-23.822-18.946-5.464-14.092-.97-30.105 3.33-43.887l21.689-65.697c2.962-10.647 10.044-29.661-8.25-29.661H197.36c-1.56 0-1.596-1.402-1.297-2.484l4.858-17.685a1.5 1.5 0 011.463-1.103l96.89-3.038c1.409-.05 1.701 1.19 1.374 2.286L259.71 346.433z"/>
        </svg>
        """;

    // SVG de estadísticas con color PrimaryColor
    private static readonly string StatsSvg = """
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 106.5">
            <path fill="#F5BA00" fill-rule="evenodd" d="M19.39,64.84v39.84a1.84,1.84,0,0,1-1.83,1.82H1.83A1.83,1.83,0,0,1,0,104.68V64.84ZM0,51.83,41.59,15.44c9.21,9,18.14,19.93,27.25,28.93L102.07,11,91.37.28,122.88,0V31.78L112.61,21.51c-7.37,7.47-24.8,23.92-32.17,31.3-9.33,9.32-13.78,9.49-23.1.17L41.59,35.46,23.13,51.83ZM114.37,38.69v66a1.84,1.84,0,0,1-1.82,1.82H96.81A1.84,1.84,0,0,1,95,104.68V57.29c3-2.91,6.5-6.29,10.07-9.73l7.45-7.17a24.16,24.16,0,0,1,1.87-1.7ZM82.71,68.34v36.34a1.84,1.84,0,0,1-1.83,1.82H65.15a1.84,1.84,0,0,1-1.83-1.82V72.22a22.48,22.48,0,0,0,5.73.63,24,24,0,0,0,13.66-4.51Zm-31.66-3v39.29a1.84,1.84,0,0,1-1.83,1.82H33.48a1.83,1.83,0,0,1-1.82-1.82V62q.48-.36.93-.75l7.86-7,6.34,7,.49.51q1.92,1.93,3.77,3.52Z"/>
        </svg>
        """;

    // SVG de información del video con color PrimaryColor
    private static readonly string VideoInfoSvg = """
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path fill="#F5BA00" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                            </svg>
                            """;

    public void Compose(IDocumentContainer container)
    {
        container
            .Page(page =>
            {
                page.Size(PageSizes.A4);
                page.Margin(30);
                page.DefaultTextStyle(x => x.FontSize(10).FontColor(Colors.Grey.Darken2).FontFamily("Heebo")); 

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
                        .Bold();

                    titleColumn.Item().Text("Informe de vigiliancia y seguridad")
                        .FontSize(14)
                        .Medium()
                        .FontColor(PrimaryColor);
                        
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
            column.Item().Height(1).Background(Colors.Grey.Darken2);
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
                    .Bold();
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
                .Background(OrangeAccentColor)
                .Height(6);
                
            decoration.Content()
                .Border(1)
                .BorderColor(PrimaryColor)
                .Background(Colors.White)
                .Height(190)
                .Padding(20)
                .Column(column =>
                {
                    column.Item().Row(row =>
                    {
                        row.ConstantItem(24).Container()
                            .Width(20)
                            .Height(20)
                            .Svg(InfoSvg); // SVG de información mejorado

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
                .BorderColor(PrimaryColor)
                .Background(Colors.White)
                .Height(190)
                .Padding(20)
                .Column(column =>
                {
                    column.Item().Row(row =>
                    {
                        row.ConstantItem(24).Container()
                            .Width(20)
                            .Height(20)
                            .Svg(StatsSvg); // SVG de estadísticas mejorado

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
                    .Bold();
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
                                    .FontColor(DarkBlue);

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
            // Título de sección con el mismo estilo que "DETALLE DE INSPECCIONES"
            column.Item().Row(row =>
            {
                row.ConstantItem(4).Height(20).Background(PrimaryColor);
                row.ConstantItem(15);
                row.RelativeItem().Text(text =>
                {
                    text.Span("INSPECCIÓN DETALLADA")
                        .FontSize(14)
                        .Bold();
                    text.Span($" - {inspection.CameraDescription}")
                        .FontSize(14)
                        .Bold()
                        .FontColor(Colors.Grey.Darken1);
                });
            });

            column.Item().Height(20);

            // Card de información del video - ancho completo
            column.Item().Element(c => ComposeVideoInfoCard(c, inspection));

            column.Item().Height(20);

            // Sección de respuestas
            column.Item().Element(c => ComposeAnswersSection(c, inspection));
        });
    }

    private void ComposeVideoInfoCard(IContainer container, InspectionRun inspection)
    {
        container.Decoration(decoration =>
        {
            decoration.Before()
                .Background(OrangeAccentColor)
                .Height(6);

            decoration.Content()
                .Border(1)
                .BorderColor(PrimaryColor)
                .Background(Colors.White)
                .Height(120)
                .Padding(20)
                .Column(column =>
                {
                    column.Item().Row(row =>
                    {
                        row.ConstantItem(24).Container()
                            .Width(20)
                            .Height(20)
                            .AlignMiddle() // Centrar verticalmente el SVG
                            .Svg(VideoInfoSvg);

                        row.ConstantItem(10);

                        row.RelativeItem().Container()
                            .AlignMiddle() // Centrar verticalmente el texto
                            .Text("INFORMACIÓN DEL VIDEO")
                            .FontSize(12)
                            .Bold()
                            .FontColor(PrimaryColor);
                    });

                    column.Item().Height(15);

                    // Dos columnas de información
                    column.Item().Row(row =>
                    {
                        // Columna izquierda
                        row.RelativeItem().Column(leftColumn =>
                        {
                            AddInfoRow(leftColumn, "Inicio:", FormatInstant(inspection.StartedAt, "HH:mm:ss"));
                            AddInfoRow(leftColumn, "Finalización:", FormatInstant(inspection.EndedAt, "HH:mm:ss"));
                        });

                        row.ConstantItem(40); // Espacio entre columnas

                        // Columna derecha
                        row.RelativeItem().Column(rightColumn =>
                        {
                            AddInfoRow(rightColumn, "Cámara:", inspection.CameraDescription);
                            AddInfoRow(rightColumn, "Duración:", CalculateDuration(inspection.StartedAt, inspection.EndedAt));
                        });
                    });
                });
    }
    );
    }

    private void ComposeAnswersSection(IContainer container, InspectionRun inspection)
    {
        container.Column(column =>
        {
            column.Item().Text("RESPUESTAS DE LA INSPECCIÓN")
                .FontSize(12)
                .Bold()
                .FontColor(PrimaryColor);

            column.Item().Height(10);

            column.Item().Text($"{inspection.OperationRun.Description}")
                .FontSize(10)
                .Bold();

            column.Item().Height(10);
            column.Item().Height(1).Background(Colors.Grey.Darken2);
            column.Item().Height(8);

            column.Item().Container()
                .Background(LightBlue)
                .Padding(15)
                .Column(contentColumn =>
                {
                    foreach (var (answer, index) in inspection.OperationRun.Answers.Select((a, i) => (a, i)))
                    {
                        if (index > 0)
                        {
                            contentColumn.Item().Height(8);
                        }
                        
                        contentColumn.Item().Element(c => ComposeQuestionAnswer(c, answer));
                    }
                });

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
                    .Bold()
                    .FontColor(Colors.Black);

                if (answer.Answer?.IsAnomalous == true)
                {
                    row.ConstantItem(70).AlignRight().Container()
                        .Background(DangerColor)
                        .Padding(3)
                        .Text("ANOMALÍA")
                        .FontSize(7)
                        .FontColor(Colors.White)
                        .Bold();
                }
            });

            column.Item().Height(3);

            column.Item().Border(0.5f)
                .BorderColor(Colors.Grey.Medium)
                .Background(Colors.White)
                .Padding(6)
                .Text(GetAnswerValue(answer.Answer))
                .FontSize(9)
                .FontColor(answer.Answer?.IsAnomalous == true ? Colors.Red.Medium : Colors.Grey.Darken2)
                .Bold();

            if (answer.Answer?.Actions?.Any() == true)
            {
                column.Item().Height(5);
                column.Item().Text("Acciones:")
                    .FontSize(9)
                    .SemiBold()
                    .FontColor(Colors.Grey.Darken2);

                column.Item().Height(5);
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
            column.Item()
                .Background(SuperLightGray)
                .Padding(6)
                .Column(actionColumn =>
                {
                    // Título de la acción con estado
                    actionColumn.Item().Row(row =>
                    {
                        row.RelativeItem().Text($"{action.Action.Description}")
                            .FontSize(9)
                            .Bold()
                            .FontColor(Colors.Black);

                        var (statusColor, statusText) = action.Executed == true ? 
                            (SuccessColor, "EJECUTADA") : 
                            (DangerColor, "NO EJECUTADA");

                        row.ConstantItem(80).AlignRight().Container()
                            .Background(statusColor)
                            .Padding(3)
                            .Text(statusText)
                            .FontSize(7)
                            .FontColor(Colors.White)
                            .Bold();
                    });

                    actionColumn.Item().Height(3);

                    if (!string.IsNullOrEmpty(action.Comments))
                    {
                        actionColumn.Item().Text("Comentarios:")
                            .FontSize(9)
                            .Bold()
                            .FontColor(Colors.Grey.Darken1);
                        
                        actionColumn.Item().Text(action.Comments)
                            .FontSize(8)
                            .FontColor(Colors.Grey.Darken3);
                    }
                });

            if (action.Alternatives?.Any() == true)
            {
                foreach (var alternative in action.Alternatives)
                {
                    column.Item().Height(10);
                    column.Item().Element(c => ComposeActionItem(c, alternative, level + 1));
                    column.Item().Height(10);

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
