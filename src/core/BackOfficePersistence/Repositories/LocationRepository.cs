using Cerberus.BackOffice.Features.OrganizationalStructure.Location;
using Cerberus.Core.MartenPersistence.Repositories;
using Marten;

namespace Cerberus.BackOffice.Persistence.Repositories;

public class LocationRepository(IDocumentSession session) : EventSourcingRepository<Location>(session);