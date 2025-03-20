using System.Collections;
using System.Text.Json;
using System.Text.Json.Serialization;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run.SetInspection;

public class RunInspectionAnswers
{
    [JsonConverter(typeof(DynamicValueConverter))]
    public Dictionary<string, object?> Answers { get; set; }
    public string AdditionalComments { get; set; }
    public Instant? StartedAt { get; set; }
}

internal static class Extensions
{
    internal static int? ToIntegerAnswer(this object? value)
    {
        return value == null ? null : Convert.ToInt32(value);
    }
    
    internal static double? ToFloatAnswer(this object? value)
    {
        return value == null ? null : Convert.ToDouble(value);
    }
    
    internal static string ToTextAnswer(this object? value) => value?.ToString() ?? string.Empty;

    internal static List<string> ToOptionsAnswer(this object? value)
    {
        if(value == null) return [];
        if (value is string)
        {
            var str = value.ToString();
            return string.IsNullOrEmpty(str) ? [] : [str];
        }
        if(value is IEnumerable enumerable) return enumerable.Cast<object>().Where(x => x != null).Select(x => x.ToString()).Where(x => string.IsNullOrEmpty(x)).ToList();
        return new List<string> { value.ToString() ?? string.Empty }.Where(x => !string.IsNullOrEmpty(x)).ToList();
    }
}

public class DynamicValueConverter : JsonConverter<Dictionary<string, object?>>
{
    public override Dictionary<string, object?> Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType != JsonTokenType.StartObject)
        {
            throw new JsonException();
        }

        var dictionary = new Dictionary<string, object?>();

        while (reader.Read())
        {
            if (reader.TokenType == JsonTokenType.EndObject)
            {
                return dictionary;
            }

            if (reader.TokenType != JsonTokenType.PropertyName)
            {
                throw new JsonException();
            }

            string propertyName = reader.GetString();

            reader.Read();
            dictionary[propertyName] = ReadValue(ref reader, options);
        }

        throw new JsonException();
    }

    private object? ReadValue(ref Utf8JsonReader reader, JsonSerializerOptions options)
    {
        switch (reader.TokenType)
        {
            case JsonTokenType.String:
                return reader.GetString();
            case JsonTokenType.Number:
                if (reader.TryGetInt32(out int intValue))
                {
                    return intValue;
                }
                if (reader.TryGetDouble(out double doubleValue))
                {
                    return doubleValue;
                }
                break;
            case JsonTokenType.StartArray:
                var list = new List<string>();
                while (reader.Read() && reader.TokenType != JsonTokenType.EndArray)
                {
                    if (reader.TokenType == JsonTokenType.String)
                    {
                        list.Add(reader.GetString());
                    }
                }
                return list;
        }
        throw new JsonException("Unsupported JSON token type.");
    }

    public override void Write(Utf8JsonWriter writer, Dictionary<string, object?> value, JsonSerializerOptions options)
    {
        throw new NotImplementedException("Serialization is not implemented.");
    }
}