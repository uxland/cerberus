using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Formatters;

namespace Cerverus.MvcUtilities;

public class InputFormater<TInput> : TextInputFormatter
{
    private readonly string _mediaType;

    public InputFormater(string mediaType)
    {
        _mediaType = mediaType;
        SupportedEncodings.Add(Encoding.UTF8);
        SupportedMediaTypes.Add(mediaType);
    }

    protected override bool CanReadType(Type? type)
    {
        return type == typeof(TInput);
    }

    public override async Task<InputFormatterResult> ReadRequestBodyAsync(InputFormatterContext context, Encoding encoding)
    {
        var request = context.HttpContext.Request;
        using var reader = new StreamReader(request.Body, encoding);
        var json = await reader.ReadToEndAsync();
        var result = JsonSerializer.Deserialize<TInput>(json);
        return await InputFormatterResult.SuccessAsync(result);
    }
}