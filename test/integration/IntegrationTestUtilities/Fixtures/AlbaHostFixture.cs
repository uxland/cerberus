using Alba;

namespace Cerberus.IntegrationTest.Utilities.Fixtures;

public class AlbaHostFixture<T>: IAsyncLifetime where T : class
{
    public IAlbaHost AlbaHost { get; private set; } = null!;
    public async Task InitializeAsync()
    {
        AlbaHost = await Alba.AlbaHost.For<T>(builder =>
        {
            
        });
    }

    public async Task DisposeAsync()
    {
        await AlbaHost.DisposeAsync();
    }
}