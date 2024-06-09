using Cerverus.BackOffice.Features.OrganizationalStructure.Location;
using Cerverus.Core.MartenPersistence.QueryProviders;
using Marten;

namespace Cerverus.BackOffice.Persistence.QueryProviders;

public class LocationEntityQueryProvider(IQuerySession session): EntityQueryProvider<Location>(session);