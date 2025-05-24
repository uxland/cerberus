using System.Text.Json;
using System.Text.Json.Serialization;

namespace Cerberus.Surveillance.Features.Features.Shared.Specs;

public class SpecJsonConverterFactory : JsonConverterFactory
{
    public override bool CanConvert(Type typeToConvert)
    {
        // Check if the type is generic
        if (!typeToConvert.IsGenericType)
            return false;

        // Get the generic type definition (Spec<>)
        var genericTypeDef = typeToConvert.GetGenericTypeDefinition();
        
        // If it's directly Spec<T>, return true
        if (genericTypeDef == typeof(Spec<>))
            return true;

        // Check base types to see if it inherits from Spec<T>
        var currentType = typeToConvert;
        while (currentType != null && currentType != typeof(object))
        {
            if (currentType.IsGenericType && currentType.GetGenericTypeDefinition() == typeof(Spec<>))
                return true;
                
            currentType = currentType.BaseType;
        }

        return false;

    }

    public override JsonConverter CreateConverter(Type type, JsonSerializerOptions options)
    {
        var valueType = type.GetGenericArguments()[0];
        var converterType = typeof(SpecJsonConverter<>).MakeGenericType(valueType);
        return (JsonConverter)Activator.CreateInstance(converterType)!;
    }
}

public class SpecJsonConverter<T> : JsonConverter<Spec<T>>
{
    private static readonly Dictionary<string, Type> TypeMap = new()
    {
        { "Not", typeof(NotSpec<T>) },
        { "And", typeof(AndSpec<T>) },
        { "Or", typeof(OrSpec<T>) },
        { "Equals", typeof(ValueEqualsSpec<T>) },
        { "GreaterThan", typeof(ValueGraterThanSpec<T>) },
        { "LowerThan", typeof(ValueLowerThanSpec<T>) }
    };

    private static readonly Dictionary<Type, string> TypeToNameMap = new()
    {
        { typeof(NotSpec<T>), "Not" },
        { typeof(AndSpec<T>), "And" },
        { typeof(OrSpec<T>), "Or" },
        { typeof(ValueEqualsSpec<T>), "Equals" },
        { typeof(ValueGraterThanSpec<T>), "GreaterThan" },
        { typeof(ValueLowerThanSpec<T>), "LowerThan" }
    };
    

    private static readonly Dictionary<string, ISpecReader> Readers = new()
    {
        { "And", new AndSpecReader() },
        { "Or", new OrSpecReader() },
        { "Not", new NotSpecReader() },
        { "Equals", new ValueEqualsSpecReader() },
        { "GreaterThan", new ValueGraterThanSpecReader() },
        { "LowerThan", new ValueLowerThanSpecReader() }
    };


    private static ISpecReader GetReader(Utf8JsonReader reader)
    {
        string typeName = null;
    
        // First pass: find the __type property
        while (reader.Read() && reader.TokenType != JsonTokenType.EndObject)
        {
            if (reader.TokenType != JsonTokenType.PropertyName)
                continue;

            string propertyName = reader.GetString();
            if (propertyName == "__type")
            {
                // Read the type value
                reader.Read();
                typeName = reader.GetString();
                break;
            }
            else
            {
                // Skip this property
                reader.Read();
                reader.Skip();
            }
        }
        if (typeName == null || !Readers.TryGetValue(typeName, out var readerInstance))
            throw new JsonException($"Unknown type name: {typeName}");
        if(!Readers.TryGetValue(typeName, out var specReader))
            throw new JsonException($"No reader found for type: {typeName}");
        return specReader;
    }

    public override Spec<T>? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var specReader = GetReader(reader);
        //   var values = new Dictionary<string, object?>();
     //   reader.Read();
        /*if (reader.TokenType == JsonTokenType.EndObject)
            throw new JsonException("Unexpected end of object");
        if (reader.TokenType != JsonTokenType.PropertyName)
            throw new JsonException("Expected property name");
        var typeProperty = reader.GetString();
        if (typeProperty != "__type")
            throw new JsonException("Expected __type property to be the first property");
        reader.Read();
        var typeName = reader.GetString() ?? "";
        if (!Readers.TryGetValue(typeName, out var specReader))
            throw new JsonException("Unexpecte type name");*/
        return specReader.Read<T>(ref reader, typeToConvert, options);
    }
    



    public override void Write(Utf8JsonWriter writer, Spec<T> value, JsonSerializerOptions options)
    {
        if (!TypeToNameMap.TryGetValue(value.GetType(), out var typeName))
            throw new JsonException($"Unknown spec type: {value.GetType()}");

        writer.WriteStartObject();
        writer.WriteString("__type", typeName);

        foreach (var prop in value.GetType().GetProperties())
        {
            if (prop.Name == "__type") continue;

            writer.WritePropertyName(options.PropertyNamingPolicy?.ConvertName(prop.Name) ?? prop.Name);
            JsonSerializer.Serialize(writer, prop.GetValue(value), prop.PropertyType, options);
        }
        
        writer.WriteEndObject();
    }
    
}

public interface ISpecReader
{
    Spec<T>? Read<T>(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options);
}

public abstract class SpecReaderBase(string refPropertyName) : ISpecReader
{
    public Spec<T>? Read<T>(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        ISpec result = null;
        while (reader.Read())
        {
            if (reader.TokenType == JsonTokenType.EndObject)
                break;

            if (reader.TokenType == JsonTokenType.PropertyName)
            {
                var propertyName = reader.GetString();
                if (propertyName?.ToLower() == refPropertyName?.ToLower())
                {
                    result = ReadFromRefProperty<T>(ref reader, typeToConvert, options);
                }
            }
        }
        return result as Spec<T>;
    }
    
    public abstract Spec<T>? ReadFromRefProperty<T>(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options);
}

internal class AndSpecReader() : SpecReaderBase(nameof(AndSpec<object>.Specs))
{
    

    public override Spec<T>? ReadFromRefProperty<T>(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var result = new AndSpec<T>();
        var specs = JsonSerializer.Deserialize<List<Spec<T>>>(ref reader, options);
        result.Specs = specs;
        return result;
    }
}

internal class OrSpecReader() : SpecReaderBase(nameof(OrSpec<object>.Specs))
{
    public override Spec<T>? ReadFromRefProperty<T>(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var specs = JsonSerializer.Deserialize<List<Spec<T>>>(ref reader, options);
        return new OrSpec<T>
        {
            Specs = specs ?? []
        };
    }
}

internal class NotSpecReader() : SpecReaderBase(nameof(NotSpec<object>.Spec))
{
    
    public override Spec<T>? ReadFromRefProperty<T>(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var spec = JsonSerializer.Deserialize<Spec<T>>(ref reader, options);
        return new NotSpec<T>
        {
            Spec = spec ?? throw new JsonException("Failed to read NotSpec")
        };
    }
}

internal class ValueEqualsSpecReader() : SpecReaderBase(nameof(ValueEqualsSpec<object>.Value))
{
    public override Spec<T>? ReadFromRefProperty<T>(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        ISpec? result = null;
        reader.Read();
        result = reader.TokenType switch
        {
            JsonTokenType.String => new ValueEqualsSpec<string>(reader.GetString()!),
            JsonTokenType.Number => BuildNumericSpec(ref reader),
            JsonTokenType.True => new ValueEqualsSpec<bool>(true),
            JsonTokenType.False => new ValueEqualsSpec<bool>(false),
            _ => null
        };
        return (Spec<T>?)result ?? throw new JsonException("Failed to read ValueEqualsSpec");
    }

    private static ISpec BuildNumericSpec(ref Utf8JsonReader reader)
    {
        if(reader.TryGetInt32(out int iintValue)) return new ValueEqualsSpec<int>(iintValue);
        if(reader.TryGetDouble(out double doubleValue)) return new ValueEqualsSpec<double>(doubleValue);
        throw new JsonException("Unsupported numeric type for ValueEqualsSpec");
    }
}

internal class ValueGraterThanSpecReader() : SpecReaderBase(nameof(ValueGraterThanSpec<object>.Value))
{

    public override Spec<T>? ReadFromRefProperty<T>(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        ISpec? result = null;
        reader.Read();
        result = reader.TokenType switch
        {
            JsonTokenType.String => new ValueGraterThanSpec<string>(reader.GetString()!),
            JsonTokenType.Number => BuildNumericSpec(ref reader),
                   
            _ => null
        };
        return (Spec<T>?)result ?? throw new JsonException("Failed to read ValueEqualsSpec");
    }

    private static ISpec BuildNumericSpec(ref Utf8JsonReader reader)
    {
        if(reader.TryGetInt32(out int iintValue)) return new ValueGraterThanSpec<int>(iintValue);
        if(reader.TryGetDouble(out double doubleValue)) return new ValueGraterThanSpec<double>(doubleValue);
        throw new JsonException("Unsupported numeric type for ValueEqualsSpec");
    }
}

internal class ValueLowerThanSpecReader() : SpecReaderBase(nameof(ValueLowerThanSpec<object>.Value))
{

    public override Spec<T>? ReadFromRefProperty<T>(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        ISpec? result = null;
        reader.Read();
        result = reader.TokenType switch
        {
            JsonTokenType.String => new ValueLowerThanSpec<string>(reader.GetString()!),
            JsonTokenType.Number => BuildNumericSpec(ref reader),
                   
            _ => null
        };
        return (Spec<T>?)result ?? throw new JsonException("Failed to read ValueEqualsSpec");
    }

    private static ISpec BuildNumericSpec(ref Utf8JsonReader reader)
    {
        if(reader.TryGetInt32(out int iintValue)) return new ValueLowerThanSpec<int>(iintValue);
        if(reader.TryGetDouble(out double doubleValue)) return new ValueLowerThanSpec<double>(doubleValue);
        throw new JsonException("Unsupported numeric type for ValueEqualsSpec");
    }
}