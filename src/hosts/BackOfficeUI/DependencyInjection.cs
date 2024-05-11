using BackOfficeUI.Components.Layout;
using BackOfficeUI.Infrastructure;

namespace BackOfficeUI;

public static class DependencyInjection
{
    public static IServiceCollection UseBackOfficeUI(this IServiceCollection services)
    {
        return services
            .AddScoped<ApiClient>()
            .AddScoped<TreeItemsLoader>();
    }
}