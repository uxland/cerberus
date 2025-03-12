using Cerberus.Core.Domain;

namespace Cerberus.Surveillance.Features.Features.Round.CreateOrUpdate;

public record CreateRound(
    RoundSettings Settings
) : ICommand;

public record UpdateRound(
    string Id,
    RoundSettings Settings
) : ICommand;