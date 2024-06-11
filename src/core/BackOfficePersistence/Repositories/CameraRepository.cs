using Cerberus.BackOffice.Features.OrganizationalStructure.Camera;
using Cerberus.Core.MartenPersistence.Repositories;
using Marten;

namespace Cerberus.BackOffice.Persistence.Repositories;

public class CameraRepository(IDocumentSession session) : EventSourcingRepository<Camera>(session);
