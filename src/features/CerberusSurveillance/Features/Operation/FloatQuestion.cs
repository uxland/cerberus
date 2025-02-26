namespace Cerberus.Surveillance.Features.Features.Operation;

public record FloatQuestion(string Id, string Text, bool IsMandatory, NormalityRange<double>? NormalityRange = null): IOperationQuestion;