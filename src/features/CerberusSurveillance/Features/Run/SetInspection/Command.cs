using Cerberus.Core.Domain;

namespace Cerberus.Surveillance.Features.Features.Run.SetInspection;

public record SetRunInspection(string RunId, string InspectionId, Dictionary<string, IOperationAnswer> OperationAnswers): ICommand<SurveillanceRun>;