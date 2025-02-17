namespace Cerberus.Surveillance.Features.Features.Operation;

public interface IOperationQuestion
{
    string Text { get; }
    bool IsMandatory { get; }
}