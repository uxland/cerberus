using System.Text.Json.Serialization;
using Cerberus.Surveillance.Features.Features.Operation;

namespace Cerberus.Surveillance.Features.Features.Run;


public record OperationActionExecution(
    bool Executed,
    string? Comments,
    OperationAction Action,
    List<OperationActionExecution> Alternatives
);

[JsonPolymorphic(TypeDiscriminatorPropertyName = "__type")]
[JsonDerivedType(typeof(OptionAnswer), "Options")]
[JsonDerivedType(typeof(TextAnswer), "Text")]
[JsonDerivedType(typeof(IntegerAnswer), "Integer")]
[JsonDerivedType(typeof(FloatAnswer), "Float")]
public interface IOperationAnswer
{
    bool IsAnomalous { get; }
    List<OperationActionExecution>? Actions { get; }
}

public record TextAnswer(string Value, bool IsAnomalous, List<OperationActionExecution>? Actions) : IOperationAnswer;

public record IntegerAnswer(int Value, bool IsAnomalous, List<OperationActionExecution>? Actions) : IOperationAnswer;

public record FloatAnswer(double Value, bool IsAnomalous, List<OperationActionExecution>? Actions) : IOperationAnswer;

public record OptionAnswerItem(string Code, bool IsAnomalous, List<OperationActionExecution>? Actions);

public record OptionAnswer(List<OptionAnswerItem> Values) : IOperationAnswer
{
    public bool IsAnomalous { get; } = Values.Any(x => x.IsAnomalous);
    public List<OperationActionExecution>? Actions { get; } = Values.SelectMany(x => x.Actions ?? []).ToList();
}
