using Cerverus.Core.MartenPersistence.QueryProviders;
using Cerverus.Features.Features.OrganizationalStructure.Camera;
using Marten;

namespace Cerverus.BackOffice.Persistence.QueryProviders;

public class CameraQueryProvider(IQuerySession session) : QueryProvider<Camera>(session), ICameraQueryProvider
{
    public async Task<IEnumerable<Camera>> GetCamerasByPath(string path)
    {
        var items= await Session.Query<Camera>().Where(c => c.Path.StartsWith(path)).ToListAsync();
        return items;
    }
}