using System.Text.Json.Serialization;
using Cerberus.Surveillance.Features.Features.Operation;

namespace Cerberus.Surveillance.Features.Features.Run;

[JsonPolymorphic(TypeDiscriminatorPropertyName = "__type")]
[JsonDerivedType(typeof(OptionAnswer), "Options")]
[JsonDerivedType(typeof(TextAnswer), "Text")]
[JsonDerivedType(typeof(IntegerAnswer), "Integer")]
[JsonDerivedType(typeof(FloatAnswer), "Float")]
public interface IOperationAnswer
{
    bool IsAnomalous { get; }
    List<OperationAction>? Actions { get; }
}

public record TextAnswer(string Value, bool IsAnomalous, List<OperationAction>? Actions) : IOperationAnswer;

public record IntegerAnswer(int Value, bool IsAnomalous, List<OperationAction>? Actions) : IOperationAnswer;

public record FloatAnswer(double Value, bool IsAnomalous, List<OperationAction>? Actions) : IOperationAnswer;

public record OptionAnswerItem(string Code, bool IsAnomalous, List<OperationAction>? Actions);

public record OptionAnswer(List<OptionAnswerItem> Values) : IOperationAnswer
{
    public bool IsAnomalous { get; } = Values.Any(x => x.IsAnomalous);
    public List<OperationAction>? Actions { get; } = Values.SelectMany(x => x.Actions ?? []).ToList();
}

public record OperationActionExecution(
    bool Performed,
    string? Comment,
    OperationAction Action,
    List<OperationActionExecution> Alternatives
);