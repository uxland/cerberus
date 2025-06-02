using System.Collections.Generic;

namespace Cerberus.Surveillance.Features.Features.Operation;

public record IntegerQuestion(
    string Id,
    string Text,
    bool IsMandatory,
    List<ActionTrigger<int>>? Triggers = null
) : IOperationQuestion<int>
{
    public bool IsAnomalous(int value) => Triggers?.Any(x => x.Condition.IsSatisfiedBy(value)) ?? false;
}