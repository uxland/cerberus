using Xunit.Abstractions;

namespace Cerberus.IntegrationTest.Utilities.Logger;

public class TestOutputHelperAccessor
{
    public ITestOutputHelper? Output { get; set; }
}