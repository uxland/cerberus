using Cerberus.Core.MartenPersistence.Repositories;
using Cerberus.Maintenance.Features.Features.Issues;
using Marten;

namespace Cerberus.Maintenance.Persistence.Repositories;

public class MaintenanceIssueRepository(IDocumentSession session): EventSourcingRepository<MaintenanceIssue>(session);