using Cerverus.BackOffice.Features.Captures;
using Cerverus.Core.MartenPersistence.QueryProviders;
using Marten;

namespace Cerverus.BackOffice.Persistence.QueryProviders;

public class CaptureEntityQueryProvider(IQuerySession session) : EntityQueryProvider<Capture>(session), ICaptureQueryProvider
{
    public async Task<List<string>> GetCameraThumbnail(string cameraId)
    {
        var captures = await Session.Query<Capture>().Where(c => c.CameraId.Equals(cameraId)).ToListAsync();
        return captures.Select(x => x.ThumbnailPath).ToList();
    }

    public Task<string> GetCameraCaptures(string cameraId)
    {
        return base.ListAsJson(c => c.CameraId.Equals(cameraId));
    }
}