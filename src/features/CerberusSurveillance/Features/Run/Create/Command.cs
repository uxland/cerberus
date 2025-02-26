
using Cerberus.Core.Domain;

namespace Cerberus.Surveillance.Features.Features.Run.Create;

public record CreateSurveillanceRun(string RoundId): ICommand<string>;