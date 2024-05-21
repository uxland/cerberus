using Cerverus.Core.MartenPersistence.QueryProviders;
using Cerverus.Features.Features.OrganizationalStructure.Location;
using Marten;

namespace Cerverus.BackOffice.Persistence.QueryProviders;

public class LocationQueryProvider(IQuerySession session): QueryProvider<Location>(session);