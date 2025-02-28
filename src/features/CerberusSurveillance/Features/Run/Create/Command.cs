
using Cerberus.Core.Domain;

namespace Cerberus.Surveillance.Features.Features.Run.Create;

public record CreateRun(string RoundId ): ICommand<string>;