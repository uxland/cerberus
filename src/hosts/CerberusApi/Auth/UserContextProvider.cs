using System.Security.Claims;
using Cerberus.Core.Domain;

namespace Cerberus.Api.Auth;

internal class UserContextProvider: IUserContextProvider
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserContextProvider(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
        CurrentUser =ToUser( _httpContextAccessor.HttpContext?.User);
    }
   
    public User CurrentUser { get; init; }
    
    private static User ToUser( ClaimsPrincipal? claimsPrincipal)
    {
        if (claimsPrincipal == null || !claimsPrincipal.Identity?.IsAuthenticated == true)
            return User.Anonymous;
        var id = claimsPrincipal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var name = claimsPrincipal.FindFirst(ClaimTypes.Name)?.Value;
        var roles = claimsPrincipal.FindAll(ClaimTypes.Role).Select(c => c.Value).ToArray();
        return new User(id ?? string.Empty, name ?? string.Empty, roles);
    }
    
}
