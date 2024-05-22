using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Formatters;

namespace Cerverus.MvcUtilities;

public class OutputFormatter<TOutput> : TextOutputFormatter
{
    private readonly string _mediaType;

    public  OutputFormatter(string mediaType)
        
    {
        _mediaType = mediaType;
        SupportedEncodings.Add(Encoding.UTF8);
        SupportedMediaTypes.Add(mediaType);
    }

    protected override bool CanWriteType(Type? type)
    {
        return type == typeof(TOutput);
    }

    public override async Task WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
    {
        var response = context.HttpContext.Response;
        response.ContentType = _mediaType;
        await using var writer = new StreamWriter(response.Body, selectedEncoding);
        var json = JsonSerializer.Serialize(context.Object);
        await writer.WriteAsync(json);
    }
}