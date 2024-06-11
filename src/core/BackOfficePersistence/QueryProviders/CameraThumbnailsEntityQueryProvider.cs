using Cerberus.BackOffice.Features.Captures.GetCameraThumbnails;
using Cerberus.Core.MartenPersistence.QueryProviders;
using Marten;

namespace Cerberus.BackOffice.Persistence.QueryProviders;

public class CameraThumbnailsEntityQueryProvider(IQuerySession session) : EntityQueryProvider<CameraThumbnails>(session), ICameraThumbnailsEntityQueryProvider
{
    
}