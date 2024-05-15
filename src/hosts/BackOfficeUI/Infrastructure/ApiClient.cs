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
}