using Cerverus.BackOffice.Features.OrganizationalStructure.Location;
using Cerverus.Core.MartenPersistence.Repositories;
using Marten;

namespace Cerverus.BackOffice.Persistence.Repositories;

public class LocationRepository(IDocumentSession session) : EventSourcingRepository<Location>(session);