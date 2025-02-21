
namespace Cerberus.Surveillance.Features.Features.Operation;

public record TextQuestion(string Id, string Text, bool IsMandatory): IOperationQuestion;