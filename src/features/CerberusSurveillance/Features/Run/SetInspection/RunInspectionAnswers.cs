using System.Collections;
using System.Text.Json;
using System.Text.Json.Serialization;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run.SetInspection;


public record AnswerActionExecution(
    string Description,
    bool Executed,
    string? Comments,
    List<AnswerActionExecution> Alternatives
    );

public class Answer
{
    [JsonConverter(typeof(DynamicValueConverter))]
    public object? Value { get; set; }
    public List<AnswerActionExecution>? Actions { get; set; }
}
    
public class RunInspectionAnswers
{
   // [JsonConverter(typeof(DynamicValueConverter))]
    public Dictionary<string, Answer?> Answers { get; set; }
    public string AdditionalComments { get; set; }
    public Instant? StartedAt { get; set; }
}

internal static class Extensions
{
    internal static int? ToIntegerAnswer(this Answer? value)
    {
        return value?.Value == null ? null : Convert.ToInt32(value.Value);
    }
    
    internal static double? ToFloatAnswer(this Answer? value)
    {
        return value?.Value == null ? null : Convert.ToDouble(value.Value);
    }
    
    internal static string ToTextAnswer(this Answer? value) => value?.Value?.ToString() ?? string.Empty;

    internal static List<string> ToOptionsAnswer(this Answer? val)
    {
        var value = val?.Value;
        if(value == null) return [];
        if (value is string)
        {
            var str = value.ToString();
            return string.IsNullOrEmpty(str) ? [] : [str];
        }
        if(value is IEnumerable enumerable) return enumerable.Cast<object>().Where(x => x != null).Select(x => x.ToString()).Where(x => !string.IsNullOrEmpty(x)).ToList();
        return new List<string> { value.ToString() ?? string.Empty }.Where(x => !string.IsNullOrEmpty(x)).ToList();
    }
}

public class DynamicValueConverter : JsonConverter<object?>
{
    public override object? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        return ReadValue(ref reader, options);
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
                    list.Add(reader.GetString());
                }
                return list;
        }
        throw new JsonException("Unsupported JSON token type.");
    }

    public override void Write(Utf8JsonWriter writer, object? value, JsonSerializerOptions options)
    {
        throw new NotImplementedException("Serialization is not implemented.");
    }
}