namespace Cerberus.Surveillance.Features.Features.Operation;

public record FloatQuestion(string Text, bool IsMandatory): IOperationQuestion;