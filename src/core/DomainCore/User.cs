namespace Cerberus.Core.Domain;

public record User(string Id, string Name, string[] Roles, string[] MemberOf)
{
    public static User Anonymous => new User(string.Empty, string.Empty, Array.Empty<string>(), Array.Empty<string>());
    public bool IsAnonymous => Id == string.Empty;
    public bool IsAuthenticated => Id != string.Empty;
    public bool IsInRole(string role) => Roles.Contains(role);
};

public interface IUserContextProvider
{
    User CurrentUser { get; }
    
    string UserId => CurrentUser.Id;
}