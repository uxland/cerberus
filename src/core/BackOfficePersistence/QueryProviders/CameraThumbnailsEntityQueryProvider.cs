using Cerverus.Core.MartenPersistence.QueryProviders;
using Cerverus.Features.Features.Captures.GetCameraThumbnails;
using Marten;

namespace Cerverus.BackOffice.Persistence.QueryProviders;

public class CameraThumbnailsEntityQueryProvider(IQuerySession session) : EntityQueryProvider<CameraThumbnails>(session), ICameraThumbnailsEntityQueryProvider
{
    
}