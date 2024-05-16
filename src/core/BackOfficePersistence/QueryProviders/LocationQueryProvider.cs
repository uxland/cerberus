using Cerverus.Core.MartenPersistence.QueryProviders;
using Cerverus.Features.Features.OrganizationalStructure.Location;
using Marten;

namespace Cerverus.BackOffice.Persistence.QueryProviders;

internal class LocationQueryProvider(IQuerySession session): QueryProvider<Location>(session);