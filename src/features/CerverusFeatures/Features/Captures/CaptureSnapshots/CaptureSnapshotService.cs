using System.Drawing;
using System.Drawing.Imaging;
using Cerverus.Core.Domain;
using Cerverus.Features.Features.OrganizationalStructure.Camera;
using NodaTime;

namespace Cerverus.Features.Features.Captures.CaptureSnapshots;

public class CaptureSnapshotService(IRepository<Capture> captureRepository, ISnapshotCatcher snapshotCatcher)
{
    public async Task CaptureSnapshot(Camera camera)
    {
        var (snapshot, error) = await snapshotCatcher.CaptureSnapshot(new CaptureSnapshotArguments(camera.AdminSettings!.IpAddress!, camera.AdminSettings!.Credentials!.Username, camera.AdminSettings!.Credentials.Password));
        var settings = new CaptureSettings(camera.Id, Instant.FromDateTimeUtc(DateTime.UtcNow), error);
        if (error == null)
        {
            var (snapshotPath, thumbnailPath) = SaveSnapshot(snapshot!, camera);
            settings = settings with
            {
                SnapshotPath = snapshotPath,
                ThumbnailPath = thumbnailPath
            };
        }

        var capture = new Capture(settings);
        await captureRepository.Create(capture);
    }
    
    private static (string ImagePath, string ThumbnailPath) SaveSnapshot(byte[] buffer, Camera camera)
    {
        var (rootPath, snapshotRelativePath) = GetCameraDirectory(camera);
        
        
        var bmpPath = Path.Combine(snapshotRelativePath, "snapshot.bmp");
        var thumbnailPath = Path.Combine(snapshotRelativePath,"thumbnail.png");
        var bitmap = new Bitmap(new MemoryStream(buffer));
        bitmap.Save(Path.Combine(rootPath, bmpPath), ImageFormat.Bmp);
        var thumbnail = bitmap.GetThumbnailImage(100, 100, null, IntPtr.Zero);
        thumbnail.Save(Path.Combine(rootPath, thumbnailPath), ImageFormat.Png);
        return (bmpPath, thumbnailPath);
    }
    
    private static (string RootPath, string SnapshotRelativePath) GetCameraDirectory(Camera camera)
    {
        var rootPath = "C:/Cerverus/Snapshots";
        var pathSegments = camera.Path.Split(">");
        var cameraRelativePath = Path.Combine(pathSegments);
        var snapshotRelativePath = Path.Combine(cameraRelativePath, $"{Instant.FromDateTimeUtc(DateTime.UtcNow).ToUnixTimeMilliseconds()}");
        var directoryInfo = new DirectoryInfo(Path.Combine(rootPath, snapshotRelativePath));
        if (!directoryInfo.Exists)
            directoryInfo.Create();
        return (rootPath, snapshotRelativePath);
    }

}