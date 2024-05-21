using Cerverus.Core.MartenPersistence.QueryProviders;
using Cerverus.Features.Features.Captures;
using Marten;

namespace Cerverus.BackOffice.Persistence.QueryProviders;

public class CaptureQueryProvider(IQuerySession session) : QueryProvider<Capture>(session), ICaptureQueryProvider
{
    public async Task<List<string>> GetCameraThumbnail(string cameraId)
    {
        var captures = await Session.Query<Capture>().Where(c => c.CameraId.Equals(cameraId)).ToListAsync();
        return captures.Select(x => x.ThumbnailPath).ToList();
    }

    public async Task<List<Capture>> GetCameraCaptures(string cameraId)
    {
        var captures = await Session.Query<Capture>().Where(c => c.CameraId.Equals(cameraId)).ToListAsync();
        return captures.ToList();
    }
}