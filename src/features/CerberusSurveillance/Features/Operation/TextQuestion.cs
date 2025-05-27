using System.Collections.Generic;

namespace Cerberus.Surveillance.Features.Features.Operation;

public record TextQuestion(
    string Id,
    string Text,
    bool IsMandatory,
    List<ActionTrigger<string>>? Triggers = null
) : IOperationQuestion<string>
{
    public bool IsAnomalous(string value) => Triggers?.Any(x => x.Condition.IsSatisfiedBy(value)) ?? false;
}