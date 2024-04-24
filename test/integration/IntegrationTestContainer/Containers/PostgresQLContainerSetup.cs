using AutoFixture;
using Testcontainers.PostgreSql;

namespace Cerverus.IntegrationTest.Utilities.TestContainer.Containers;

public static class PostgresQLContainerSetup
{
    public static async Task<string> StartPostgresQlContainer(this IFixture fixture)
    {
        var container = await StartPostgresQlContainer();
        return container.GetConnectionString();
    }

    public static async Task<PostgreSqlContainer> StartPostgresQlContainer()
    {
        var container = new PostgreSqlBuilder()
            .WithImage("postgres:16")
            .Build();
        await container.StartAsync();
        return container;
    }
}