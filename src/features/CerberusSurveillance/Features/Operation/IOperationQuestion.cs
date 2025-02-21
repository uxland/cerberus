namespace Cerberus.Surveillance.Features.Features.Operation;

public interface IOperationQuestion
{
    string Id { get; }
    string Text { get; }
    bool IsMandatory { get; }
}