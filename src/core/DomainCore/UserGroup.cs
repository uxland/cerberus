namespace Cerberus.Core.Domain;

public record UserGroup(string Id, string Description, List<UserGroup> SubGroups)
{
    public UserGroup(string id, string description) : this(id, description, [])
    {
    }
};