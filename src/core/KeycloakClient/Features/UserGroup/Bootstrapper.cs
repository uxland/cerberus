using Cerberus.Core.Domain;
using Microsoft.Extensions.DependencyInjection;

namespace Cerberus.Core.KeycloakClient.Features.UserGroup;

internal static class Bootstrapper
{
    public static IServiceCollection UseUserGroupProvider(this IServiceCollection services)
    {
        return services.AddTransient<IUserGroupProvider, UserGroupProvider>();
    }
}