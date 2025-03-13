namespace Cerberus.Surveillance.Features.Features.Operation;

public record IntegerQuestion(string Id, string Text, bool IsMandatory, NormalityRange<int>? NormalityRange = null)
    : IOperationQuestion
{
    public bool IsAnomalous(int value) => NormalityRange?.IsOutOfRange(value) ?? false;
}