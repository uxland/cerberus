using Cerberus.Core.Domain;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run.Release;


public record ReleaseRunData(string? AdditionalComments = null);

public record ReleaseRun(string RunId, Instant At, string By, string? AdditionalComments = null): ICommand;