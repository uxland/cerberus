using Cerverus.Core.XabeFFMpegClient;
using Cerverus.Features.Features.Captures.CaptureSnapshots;
using Cerverus.IntegrationTest.Utilities.Logger;
using Lamar;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Xunit.Abstractions;

namespace XabeFFMegClient.Tests;

public class XabeFfMpegClientTests
{
    private readonly SnapshotCapturer _sut;

    public XabeFfMpegClientTests(ITestOutputHelper outputHelperAccessor)
    {
        var logger =  XUnitLogger.CreateLogger<SnapshotCapturer>(outputHelperAccessor);
        Bootstrapper.BootstrapXabeFFMpegClient(new ServiceRegistry());
        var settings = Options.Create(new SnapshotCaptureSettings{FolderRoot = Environment.CurrentDirectory});
        this._sut = new SnapshotCapturer(settings, logger);
    }

    [Fact]
    public async Task TestXabeFFMpegClient()
    {
        var args = new CaptureSnapshotArguments("192.168.1.64:554", "admin", "-Videologic99", "CAT>GIR>CAm3");
        var actual = await this._sut.CaptureSnapshot(args);
        Assert.NotNull(actual.SnapshotRawPath);
        Assert.Null(actual.Error);
        foreach (var se in new []{actual.SnapshotRawPath, actual.SnapshotThumbnailPath, actual.SnapshotPath})
            Assert.True(File.Exists(Path.Combine(Environment.CurrentDirectory, se!)));
    }
}