using System.Collections;
using System.Text.Json.Serialization;

namespace Cerberus.Surveillance.Features.Features.Run;

[JsonPolymorphic(TypeDiscriminatorPropertyName = "__type")]
[JsonDerivedType(typeof(OptionAnswer), "Options")]
[JsonDerivedType(typeof(TextAnswer), "Text")]
[JsonDerivedType(typeof(IntegerAnswer), "Integer")]
[JsonDerivedType(typeof(FloatAnswer), "Float")]
public interface IOperationAnswer
{
    bool IsAnomalous { get; }
}

public record TextAnswer(string Value) : IOperationAnswer{
    public bool IsAnomalous { get; } = false;
}

public record IntegerAnswer(int Value, bool IsAnomalous) : IOperationAnswer;

public record FloatAnswer(double Value, bool IsAnomalous) : IOperationAnswer;

public record OptionAnswerItem(string Code, bool IsAnomalous);

public record OptionAnswer(List<OptionAnswerItem> Values) : IOperationAnswer
{
    public bool IsAnomalous { get; } = Values.Any(x => x.IsAnomalous);
}

