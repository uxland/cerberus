using System.Net.Http.Headers;

namespace BackOfficeUI.Infrastructure;

public class ApiClient(HttpClient httpClient)
{
    const string API_BASE_URL = "http://localhost:5222/api/";
    public Task<T?> GetItems<T>(string path)
    {
        var uri = new Uri(Path.Combine(API_BASE_URL, path));
        return httpClient.GetFromJsonAsync<T>(uri);
    } 
    public Task PostCommand(string path, object? command)
    {
        var uri = new Uri(Path.Combine(API_BASE_URL, path));
        return httpClient.PostAsJsonAsync(uri, command);
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