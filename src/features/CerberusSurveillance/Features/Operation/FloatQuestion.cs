namespace Cerberus.Surveillance.Features.Features.Operation;

public record FloatQuestion(string Id, string Text, bool IsMandatory): IOperationQuestion;