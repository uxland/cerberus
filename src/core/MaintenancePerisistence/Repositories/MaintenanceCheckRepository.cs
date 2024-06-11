using Cerberus.Core.MartenPersistence.Repositories;
using Cerberus.Maintenance.Features.Features.MaintenanceChecks;
using Marten;

namespace Cerberus.Maintenance.Persistence.Repositories;

public class MaintenanceCheckRepository(IDocumentSession session): EventSourcingRepository<MaintenanceCheck>(session);