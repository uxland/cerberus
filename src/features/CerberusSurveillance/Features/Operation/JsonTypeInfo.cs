using System.Text.Json.Serialization;

namespace Cerberus.Surveillance.Features.Features.Operation;

using System.Text.Json.Serialization.Metadata;
public static class OperationJsonTypeInfo
{
    private static void OperationQuestionSerializer(JsonTypeInfo typeInfo)
    {
        if (typeInfo.Type != typeof(IOperationQuestion)) return;
        typeInfo.PolymorphismOptions = new JsonPolymorphismOptions
        {
            TypeDiscriminatorPropertyName = "__type",
            IgnoreUnrecognizedTypeDiscriminators = true,
            UnknownDerivedTypeHandling = JsonUnknownDerivedTypeHandling.FailSerialization
        };
        typeInfo.PolymorphismOptions.DerivedTypes.Add(new JsonDerivedType(typeof(OptionsQuestion), "Options"));
        typeInfo.PolymorphismOptions.DerivedTypes.Add(new JsonDerivedType(typeof(TextQuestion), "Text"));
        typeInfo.PolymorphismOptions.DerivedTypes.Add(new JsonDerivedType(typeof(IntegerQuestion), "Integer"));
        typeInfo.PolymorphismOptions.DerivedTypes.Add(new JsonDerivedType(typeof(FloatQuestion), "Float"));
    }
    
    public static DefaultJsonTypeInfoResolver UseOperationJsonTypeInfo(this DefaultJsonTypeInfoResolver resolver)
    {
        resolver.Modifiers.Add(OperationQuestionSerializer);
        return resolver;
    }
}
