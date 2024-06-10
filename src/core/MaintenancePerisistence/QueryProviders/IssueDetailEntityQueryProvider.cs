using Cerberus.Core.MartenPersistence.QueryProviders;
using Cerberus.Maintenance.Features.Features.Issues.GetDetail;
using Marten;

namespace Cerberus.Maintenance.Persistence.QueryProviders;

public class IssueDetailEntityQueryProvider(IQuerySession session): EntityQueryProvider<MaintenanceIssueDetail>(session), IMaintenanceIssueEntityQueryProvider;