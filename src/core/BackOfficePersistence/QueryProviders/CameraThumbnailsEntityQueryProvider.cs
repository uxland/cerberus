using Cerverus.BackOffice.Features.Captures.GetCameraThumbnails;
using Cerverus.Core.MartenPersistence.QueryProviders;
using Marten;

namespace Cerverus.BackOffice.Persistence.QueryProviders;

public class CameraThumbnailsEntityQueryProvider(IQuerySession session) : EntityQueryProvider<CameraThumbnails>(session), ICameraThumbnailsEntityQueryProvider
{
    
}