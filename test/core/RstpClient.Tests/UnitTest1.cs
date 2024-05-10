using Cerverus.IntegrationTest.Utilities.Logger;
using Xunit.Abstractions;

namespace Cerverus.Core.RstpClient;

public class TestRstpClient(ITestOutputHelper outputHelperAccessor)
{
    

   [Fact]
    public async Task RstpClientImplementationTest()
    {
        var sut = new RstpClientImplementation(XUnitLogger.CreateLogger<RstpClientImplementation>(outputHelperAccessor));
        var result = await sut.CaptureSnapshot("rtsp://ip_adx/cam1/h264", "root", "root");
        Assert.NotNull(result.stream);
   
    }
}