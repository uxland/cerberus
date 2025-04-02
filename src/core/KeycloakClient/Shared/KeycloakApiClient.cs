using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using KeycloakClient.Features;
using Microsoft.Extensions.Options;

namespace KeycloakClient.Shared;

public class KeycloakApiClient(HttpClient httpClient,  IOptions<KeycloakOptions> options)
{
    private class TokenResponse
    {
        [JsonPropertyName("access_token")]
        public string AccessToken { get; set; }
        [JsonPropertyName("expires_in")]
        public int ExpiresIn { get; set; }
    }
    private readonly KeycloakOptions _options = options.Value;
    private string? _cachedToken;
    private DateTime _tokenExpiry;
    private async Task<string> GetAccessTokenAsync()
    {
        if (_cachedToken != null && _tokenExpiry > DateTime.UtcNow.AddMinutes(1))
            return _cachedToken;

        var form = new Dictionary<string, string>
        {
            ["client_id"] = _options.ClientId,
            ["client_secret"] = _options.ClientSecret,
            ["grant_type"] = "client_credentials"
        };

        var response = await httpClient.PostAsync(
            $"realms/{_options.Realm}/protocol/openid-connect/token",
            new FormUrlEncodedContent(form));

        response.EnsureSuccessStatusCode();

        
        var token = await response.Content.ReadFromJsonAsync<TokenResponse>();
        _cachedToken = token?.AccessToken;
        _tokenExpiry = DateTime.UtcNow.AddSeconds(token.ExpiresIn);

        return _cachedToken ?? string.Empty;
    }
    
    public async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request)
    {
        var token = await GetAccessTokenAsync();
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        return await httpClient.SendAsync(request);
    }

    public async Task<T?> GetAsync<T>(string path)
    {
        var request = new HttpRequestMessage(HttpMethod.Get, path);
        var response = await SendAsync(request);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadFromJsonAsync<T>();
    }
}