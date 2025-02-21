namespace Cerberus.Surveillance.Features.Features.Operation;

public record IntegerQuestion(string Id, string Text, bool IsMandatory): IOperationQuestion;