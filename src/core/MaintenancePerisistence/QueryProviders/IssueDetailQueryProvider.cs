using Cerverus.Core.MartenPersistence.QueryProviders;
using Cerverus.Maintenance.Features.Features.Issues.GetDetail;
using Marten;

namespace Cerverus.Maintenance.Persistence.QueryProviders;

public class IssueDetailQueryProvider(IQuerySession session): QueryProvider<MaintenanceIssueDetail>(session), IMaintenanceIssueQueryProvider;