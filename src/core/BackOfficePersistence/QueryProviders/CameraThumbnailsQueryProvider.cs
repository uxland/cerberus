using Cerverus.Core.MartenPersistence.QueryProviders;
using Cerverus.Features.Features.Captures.GetCameraThumbnails;
using Marten;

namespace Cerverus.BackOffice.Persistence.QueryProviders;

public class CameraThumbnailsQueryProvider(IQuerySession session) : QueryProvider<CameraThumbnails>(session), ICameraThumbnailsQueryProvider
{
    
}