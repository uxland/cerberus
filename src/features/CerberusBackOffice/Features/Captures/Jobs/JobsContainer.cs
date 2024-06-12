using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.Captures.Jobs;

public class ChronContainer(): AggregateRoot(ID)
{
    internal const string ID = "ChronsContainer";
    public Dictionary<string, List<string>> RecurrencePatterns { get; set; } = new();
}

public record ChronContainerCreatedOrChanged(): IDomainEvent;
