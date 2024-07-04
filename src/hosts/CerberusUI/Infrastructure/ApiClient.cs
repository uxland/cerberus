using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.Json.Serialization;
using NodaTime;
using NodaTime.Serialization.SystemTextJson;

namespace Cerberus.UI.Infrastructure;

public class ApiClient(HttpClient httpClient, IConfiguration configuration)
{
    private readonly string API_BASE_URL = configuration["Backend:Url"];
    private static readonly JsonSerializerOptions jsonSerializerOptions;
    static ApiClient()
    {
        jsonSerializerOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            PropertyNameCaseInsensitive = true,
            Converters =
            {
                new JsonStringEnumConverter(JsonNamingPolicy.CamelCase)
            }
        };
        jsonSerializerOptions.ConfigureForNodaTime(DateTimeZoneProviders.Tzdb);
    }
    //const string API_BASE_URL = "http://localhost:5222/api/";
    public async Task<T?> GetItems<T>(string path)
    {
        var uri = new Uri(Path.Combine(API_BASE_URL, path));
        var json = await httpClient.GetStringAsync(uri);
        if (json.StartsWith("\""))
            json = JsonSerializer.Deserialize<string>(json);
        var result = JsonSerializer.Deserialize<T?>(json, jsonSerializerOptions);
        return result;
        
    } 
    public Task PostCommand(string path, object? command)
    {
        var uri = new Uri(Path.Combine(API_BASE_URL, path));
        return httpClient.PostAsJsonAsync(uri, command);
    }
    
    public Task PutCommand(string path, object? command)
    {
        var uri = new Uri(Path.Combine(API_BASE_URL, path));
        return httpClient.PutAsJsonAsync(uri, command);
    }
    
    public async Task PostFile(string path, byte[] buffer, string fileName)
    {
        var content = new MultipartFormDataContent();
        content.Headers.ContentDisposition = new ContentDispositionHeaderValue("form-data")
        {
            Name = "file",
            FileName = fileName
        };
        content.Add(new ByteArrayContent(buffer), "file", fileName);
        var uri = new Uri(Path.Combine(API_BASE_URL, path));
       
        var result = await httpClient.PostAsync(uri, content);
        var messge = result.Content.ReadAsStringAsync().Result;
        Console.WriteLine(messge);
    }
}