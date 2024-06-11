using Cerberus.BackOffice.Features.Captures;
using Cerberus.Core.MartenPersistence.QueryProviders;
using Marten;

namespace Cerberus.BackOffice.Persistence.QueryProviders;

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