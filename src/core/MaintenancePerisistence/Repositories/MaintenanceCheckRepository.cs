using Cerverus.Core.MartenPersistence.Repositories;
using Cerverus.Maintenance.Features.Features.MaintenanceChecks;
using Marten;

namespace Cerverus.Maintenance.Persistence.Repositories;

public class MaintenanceCheckRepository(IDocumentSession session): EventSourcingRepository<MaintenanceCheck>(session);