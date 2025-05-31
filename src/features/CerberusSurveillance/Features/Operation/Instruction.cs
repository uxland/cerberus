namespace Cerberus.Surveillance.Features.Features.Operation;

public interface IInstruction
{
    string Text { get; }
    bool IsMandatory { get; }
}

public record Instruction(string Text, bool IsMandatory) : IInstruction;
