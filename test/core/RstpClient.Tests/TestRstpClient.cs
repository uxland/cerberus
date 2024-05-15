using Cerverus.Features.Features.Captures.CaptureSnapshots;
using Cerverus.IntegrationTest.Utilities.Logger;
using Xunit.Abstractions;

namespace Cerverus.Core.RstpClient;

public class TestRstpClient
{
    private readonly ITestOutputHelper _outputHelperAccessor;

    public TestRstpClient(ITestOutputHelper outputHelperAccessor)
    {
        _outputHelperAccessor = outputHelperAccessor;
        DependencyInjection.SetupCodecs();
    }

   [Fact]
    public async Task RstpClientImplementationTest()
    {
        var sut = new RstpClientImplementation(XUnitLogger.CreateLogger<RstpClientImplementation>(this._outputHelperAccessor));
        var args = new CaptureSnapshotArguments("rtsp://ip_adx/cam1/h264", "admin", "-Videologic99");
        var result = await sut.CaptureSnapshot(args);
        Assert.NotNull(result.Buffer);
    }
}