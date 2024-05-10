
using Cerverus.Core.MartenPersistence.Repositories;
using Cerverus.Features.Features.OrganizationalStructure.Camera;
using Marten;
using Marten.Events.Aggregation;

namespace Cerverus.BackOffice.Persistence.Repositories;

public class CameraRepository(IDocumentSession session) : EventSourcingRepository<Camera>(session);
