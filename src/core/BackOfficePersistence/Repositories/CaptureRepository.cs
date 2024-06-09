using Cerverus.BackOffice.Features.Captures;
using Cerverus.Core.MartenPersistence.Repositories;
using Marten;

namespace Cerverus.BackOffice.Persistence.Repositories;

public class CaptureRepository(IDocumentSession session) : EventSourcingRepository<Capture>(session);