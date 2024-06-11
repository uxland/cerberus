using Xunit.Abstractions;

namespace Cerberus.IntegrationTest.Utilities.Fixtures;

public interface IHostFixture: IAsyncLifetime
{
    IServiceProvider ServiceProvider { get; }
    ITestOutputHelper TestOutputHelper { get; }
    void SetTestOutput(ITestOutputHelper testOutputHelper);
    
}