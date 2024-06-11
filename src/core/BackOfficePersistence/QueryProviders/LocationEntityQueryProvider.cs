using Cerberus.BackOffice.Features.OrganizationalStructure.Location;
using Cerberus.Core.MartenPersistence.QueryProviders;
using Marten;

namespace Cerberus.BackOffice.Persistence.QueryProviders;

public class LocationEntityQueryProvider(IQuerySession session): EntityQueryProvider<Location>(session);