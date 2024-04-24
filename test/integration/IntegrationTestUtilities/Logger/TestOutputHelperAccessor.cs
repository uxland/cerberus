using Xunit.Abstractions;

namespace Cerverus.IntegrationTest.Utilities.Logger;

public class TestOutputHelperAccessor
{
    public ITestOutputHelper? Output { get; set; }
}