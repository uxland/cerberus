
using Cerverus.BackOffice.Features.OrganizationalStructure.Camera;
using Cerverus.Core.MartenPersistence.Repositories;
using Marten;
using Marten.Events.Aggregation;

namespace Cerverus.BackOffice.Persistence.Repositories;

public class CameraRepository(IDocumentSession session) : EventSourcingRepository<Camera>(session);
