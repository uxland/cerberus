using System.Collections.Generic;

namespace Cerberus.Surveillance.Features.Features.Operation;

public record IntegerQuestion(
    string Id,
    string Text,
    bool IsMandatory,
    NormalityRange<int>? NormalityRange = null,
    IEnumerable<IInstruction>? Instructions = null
) : IOperationQuestion
{
    public bool IsAnomalous(int value) => NormalityRange?.IsOutOfRange(value) ?? false;
}