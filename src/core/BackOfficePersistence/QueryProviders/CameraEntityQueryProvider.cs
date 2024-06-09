using Cerverus.BackOffice.Features.OrganizationalStructure.Camera;
using Cerverus.Core.MartenPersistence.QueryProviders;
using Marten;

namespace Cerverus.BackOffice.Persistence.QueryProviders;

public class CameraEntityQueryProvider(IQuerySession session) : EntityQueryProvider<Camera>(session), ICameraEntityQueryProvider
{
    public async Task<IEnumerable<Camera>> GetCamerasByPath(string path)
    {
        var items= await Session.Query<Camera>().Where(c => c.Path.StartsWith(path)).ToListAsync();
        return items;
    }

    public async Task<IEnumerable<string>> GetCameraIdsByPath(string path)
    {
        return await Session.Query<Camera>().Where(c => c.Path.StartsWith(path)).Select(c => c.Id).ToListAsync();
    }
}