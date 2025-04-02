using Cerberus.Core.Domain;
using KeycloakClient.Shared;
using Microsoft.Extensions.Options;

namespace KeycloakClient.Features.UserGroup;

public class UserGroupProvider(KeycloakApiClient apiClient, IOptions<KeycloakOptions> options): IUserGroupProvider
{
    private class KeycloakGroup
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Path { get; set; }
        public List<KeycloakGroup> SubGroups { get; set; }
    }
    private KeycloakOptions _options = options.Value;

    public async Task<IEnumerable<Cerberus.Core.Domain.UserGroup>> ListAllAsync(CancellationToken cancellationToken)
    {
        var path = $"admin/realms/{_options.Realm}/groups";
        var groups = await (apiClient.GetAsync<IEnumerable<KeycloakGroup>>(path)) ?? [];
        return groups.Single(x => x.Id == "surveillance").SubGroups.Select(s => new Cerberus.Core.Domain.UserGroup(s.Id, s.Name,  []));
    }
}