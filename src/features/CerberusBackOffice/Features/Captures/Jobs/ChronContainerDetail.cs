using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.Captures.Jobs;

public class ChronContainerDetail(): Entity(ChronContainer.ID)
{
    public Dictionary<string, List<string>> RecurrencePatterns { get; set; } = new();
}