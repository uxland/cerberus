using System.Text.Json.Serialization;

namespace Cerberus.Surveillance.Features.Features.Operation;

[JsonPolymorphic(TypeDiscriminatorPropertyName = "__type")]
[JsonDerivedType(typeof(OptionsQuestion), "Options")]
[JsonDerivedType(typeof(TextQuestion), "Text")]
[JsonDerivedType(typeof(IntegerQuestion), "Integer")]
[JsonDerivedType(typeof(FloatQuestion), "Float")]
public interface IOperationQuestion
{
    string Id { get; }
    string Text { get; }
    bool IsMandatory { get; }
}


public interface IOperationQuestion<T>: IOperationQuestion
{
    List<Trigger<T>>? Triggers { get; }
    bool IsAnomalous(T value);
}