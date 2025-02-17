
namespace Cerberus.Surveillance.Features.Features.Operation;

public record TextQuestion(string Text, bool IsMandatory): IOperationQuestion;