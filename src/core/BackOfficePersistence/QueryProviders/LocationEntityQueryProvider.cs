using Cerverus.Core.MartenPersistence.QueryProviders;
using Cerverus.Features.Features.OrganizationalStructure.Location;
using Marten;

namespace Cerverus.BackOffice.Persistence.QueryProviders;

public class LocationEntityQueryProvider(IQuerySession session): EntityQueryProvider<Location>(session);