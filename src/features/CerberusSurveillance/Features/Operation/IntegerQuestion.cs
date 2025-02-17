namespace Cerberus.Surveillance.Features.Features.Operation;

public record IntegerQuestion(string Text, bool IsMandatory): IOperationQuestion;