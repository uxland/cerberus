using Cerberus.Core.Domain;

namespace Cerberus.Surveillance.Features.Features.Run.Start;

public record  StartRun(string RunId) : ICommand;