using Cerverus.Core.MartenPersistence.QueryProviders;
using Cerverus.Maintenance.Features.Features.Issues.ListByLocationPath;
using Marten;

namespace Cerverus.Maintenance.Persistence.QueryProviders;

public class MaintenanceIssueSummaryQueryProvider(IQuerySession session): QueryProvider<MaintenanceIssueSummary>(session), IMaintenanceIssueSummaryQueryProvider
{
    public Task<string> ListByLocationPathAsJson(string locationPath)
    {
        return base.ListAsJson(x => x.Path.StartsWith(locationPath));
    }
}