using Cerberus.IntegrationTest.Utilities.Fixtures;
using Xunit.Abstractions;

namespace Cerberus.Features.Fixtures;

public class BackOfficeFixture: IHostFixture
{
    public Task InitializeAsync()
    {
        //Todo: Implement
        return Task.CompletedTask;
    }

    public Task DisposeAsync()
    {
        //Todo: Implement
        return Task.CompletedTask;
    }

    public IServiceProvider ServiceProvider { get; }
    public ITestOutputHelper TestOutputHelper { get; private set;}
    public void SetTestOutput(ITestOutputHelper testOutputHelper)
    {
        this.TestOutputHelper = testOutputHelper;
    }
}