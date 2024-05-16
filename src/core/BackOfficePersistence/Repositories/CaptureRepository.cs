using Cerverus.Core.MartenPersistence.Repositories;
using Cerverus.Features.Features.Captures;
using Marten;

namespace Cerverus.BackOffice.Persistence.Repositories;

public class CaptureRepository(IDocumentSession session) : EventSourcingRepository<Capture>(session);