namespace Cerberus.Core.Domain;

public interface IUserGroupProvider
{
    public Task<IEnumerable<UserGroup>> ListAllAsync(CancellationToken cancellationToken);
}