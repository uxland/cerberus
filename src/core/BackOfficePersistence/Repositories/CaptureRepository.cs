using Cerberus.BackOffice.Features.Captures;
using Cerberus.Core.MartenPersistence.Repositories;
using Marten;

namespace Cerberus.BackOffice.Persistence.Repositories;

public class CaptureRepository(IDocumentSession session) : EventSourcingRepository<Capture>(session);