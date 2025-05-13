using System.Collections.Generic;

namespace Cerberus.Surveillance.Features.Features.Operation;

public record FloatQuestion(
    string Id,
    string Text,
    bool IsMandatory,
    NormalityRange<double>? NormalityRange = null,
    IEnumerable<IInstruction>? Instructions = null
) : IOperationQuestion
{
    public bool IsAnomalous(double value) => NormalityRange?.IsOutOfRange(value) ?? false;
}