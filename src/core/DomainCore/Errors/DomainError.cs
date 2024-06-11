namespace Cerberus.Core.Domain.Errors;

public abstract class DomainError(string message)
{
    public string Message { get; } = message;
}