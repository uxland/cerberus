using System.Collections.Generic;

namespace Cerberus.Surveillance.Features.Features.Operation;

public record FloatQuestion(
    string Id,
    string Text,
    bool IsMandatory,
    List<ActionTrigger<double>>? Triggers = null
) : IOperationQuestion<double>
{
    public bool IsAnomalous(double value) => Triggers?.Any(x => x.Condition.IsSatisfiedBy(value)) ?? false;
}