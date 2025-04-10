using Cerberus.Core.Domain;
using Cerberus.Core.KeycloakClient.Shared;
using Microsoft.Extensions.Options;

namespace Cerberus.Core.KeycloakClient.Features.UserGroup;

public class UserGroupProvider(KeycloakApiClient apiClient, IOptions<KeycloakOptions> options) : IUserGroupProvider
{
    private readonly KeycloakOptions _options = options.Value;

    public Task<IEnumerable<Cerberus.Core.Domain.UserGroup>> ListAllAsync(CancellationToken cancellationToken)
    {
        return GetSubgroupsOf("surveillance");
    }

    private async Task<IEnumerable<Cerberus.Core.Domain.UserGroup>> GetSubgroupsOf(string parentGroupId)
    {
        var path = $"admin/realms/{_options.Realm}/groups/{parentGroupId}/children";
        var groups =
            (await apiClient.GetAsync<IEnumerable<KeycloakGroup>>(path) ?? Array.Empty<KeycloakGroup>()).ToList();
        var result = groups.Select(x => new Cerberus.Core.Domain.UserGroup(x.Path, x.Name, []));
        var childrenTasks = groups.Where(g => g.SubGroupCount > 0)
            .Select(g => GetSubgroupsOf(g.Id));
        var children = await Task.WhenAll(childrenTasks);
        return result.Concat(children.SelectMany(g => g));
    }

    private class KeycloakGroup
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Path { get; set; }
        public int SubGroupCount { get; set; }
    }
}