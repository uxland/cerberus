using System.Text.Json.Serialization.Metadata;
using Cerberus.Surveillance.Features;

namespace Cerberus.Api.Bootstrap;

internal static class JsonSerialization
{
    private static readonly DefaultJsonTypeInfoResolver _typeInfoResolver;

    public static IJsonTypeInfoResolver TypeInfoResolver => _typeInfoResolver;
    
    static JsonSerialization()
    {
        _typeInfoResolver = new DefaultJsonTypeInfoResolver();
        _typeInfoResolver.UseSurveillanceSerialization();
    }
}