using System.Text.Json.Serialization;
using System.Text.Json.Serialization.Metadata;

namespace Cerberus.Surveillance.Features.Features.Run;

public static class OperationRunJsonTypeInfo
{
    private static void OperationRunAnswerSerializer(JsonTypeInfo typeInfo)
    {
        if(typeInfo.Type != typeof(IOperationAnswer)) return;
        typeInfo.PolymorphismOptions = new JsonPolymorphismOptions
        {
            TypeDiscriminatorPropertyName = "__type",
            IgnoreUnrecognizedTypeDiscriminators = true,
            UnknownDerivedTypeHandling = JsonUnknownDerivedTypeHandling.FailSerialization
        };
        typeInfo.PolymorphismOptions.DerivedTypes.Add(new JsonDerivedType(typeof(OptionAnswer), "Options"));
        typeInfo.PolymorphismOptions.DerivedTypes.Add(new JsonDerivedType(typeof(TextAnswer), "Text"));
        typeInfo.PolymorphismOptions.DerivedTypes.Add(new JsonDerivedType(typeof(IntegerAnswer), "Integer"));
        typeInfo.PolymorphismOptions.DerivedTypes.Add(new JsonDerivedType(typeof(FloatAnswer), "Float"));
    }

    internal static DefaultJsonTypeInfoResolver UseOperationRunJsonTypeInfo(this DefaultJsonTypeInfoResolver resolver)
    {
        resolver.Modifiers.Add(OperationRunAnswerSerializer);
        return resolver;
    }
}