using Cerberus.Core.Domain;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run.SetInspection;

public record SetRunInspection(string RunId, string InspectionId, string By, Instant At, RunInspectionAnswers OperationAnswers): ICommand<SurveillanceRun>;