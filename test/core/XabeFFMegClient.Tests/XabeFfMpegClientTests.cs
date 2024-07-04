using Cerberus.BackOffice.Features.Captures.CaptureSnapshots;
using Cerberus.Core.XabeFFMpegClient.CaptureMiddlewares;
using Cerberus.Core.XabeFFMpegClient.ConversionBuilders;
using Cerberus.IntegrationTest.Utilities.Logger;
using Lamar;
using Microsoft.Extensions.Options;
using Xunit.Abstractions;

namespace Cerberus.Core.XabeFFMpegClient;

public class XabeFfMpegClientTests
{
    private readonly SnapshotCapturer _sut;

    public XabeFfMpegClientTests(ITestOutputHelper outputHelperAccessor)
    {
        var logger =  XUnitLogger.CreateLogger<SnapshotCapturer>(outputHelperAccessor);
        Bootstrapper.BootstrapXabeFFMpegClient(new ServiceRegistry());
        var settings = Options.Create(new SnapshotCaptureSettings{FolderRoot = Environment.CurrentDirectory});
        var middleware = new ConversionBuilder(
            new IConversionBuilderStep[]
            {
                new DurationBuilder(),
                new FileBuilder(),
                new RstpBuilder(),
                new MonochromeBuilder()
            }
        );
        this._sut = new SnapshotCapturer(settings, logger, middleware);
    }

    [Fact]
    public async Task TestXabeFFMpegClient()
    {
        var args = new CaptureSnapshotArguments("file://Users/danipinartnadal/Documents/Cerberus/cerberus/Snapshots/8.mp4", "admin", "-Videologic99", "CAT>GIR>CAm3");
        var actual = await this._sut.CaptureSnapshot(args);
        Assert.NotNull(actual.SnapshotRawPath);
        Assert.Null(actual.Error);
        foreach (var se in new []{actual.SnapshotRawPath, actual.SnapshotThumbnailPath})
            Assert.True(File.Exists(Path.Combine(Environment.CurrentDirectory, se!)));
    }
}