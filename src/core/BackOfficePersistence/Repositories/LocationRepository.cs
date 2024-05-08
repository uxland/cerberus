using Cerverus.Core.MartenPersistence.Repositories;
using Cerverus.Features.Features.OrganizationalStructure.Location;
using Marten;

namespace Cerverus.BackOffice.Persistence.Repositories;

public class LocationRepository(IDocumentSession session) : EventSourcingRepository<Location>(session);