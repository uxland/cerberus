using Cerverus.Core.MartenPersistence.Repositories;
using Cerverus.Maintenance.Features.Features.Issues;
using Marten;

namespace Cerverus.Maintenance.Persistence.Repositories;

public class MaintenanceIssueRepository(IDocumentSession session): EventSourcingRepository<MaintenanceIssue>(session);