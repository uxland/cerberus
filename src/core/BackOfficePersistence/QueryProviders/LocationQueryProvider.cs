using Cerverus.Core.MartenPersistence.QueryProviders;
using Cerverus.Features.Features.OrganizationalStructure.Location;
using Marten;

namespace Cerverus.BackOffice.Persistence.QueryProviders;

internal class LocationQueryProvider(IQuerySession querySession): QueryProvider<Location>(querySession)
{
    
}