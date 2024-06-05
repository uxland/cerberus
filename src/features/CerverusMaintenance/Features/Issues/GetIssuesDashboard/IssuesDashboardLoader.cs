using System.Linq.Expressions;
using Cerverus.Core.Domain;
using Cerverus.Core.Domain.Spec;
using NodaTime;

namespace Cerverus.Maintenance.Features.Features.Issues.GetIssuesDashboard;

public class IssuesDashboardLoader(IReadModelQueryProvider queryProvider)
{
    public Task<IssuesDashboard> GetIssuesDashboard(string locationPath)
    {
        /*var spec = new IssueInLocationSpec(locationPath) & (new IssueStatusSpec(MaintenanceIssueStatus.Open));
        var detail = await queryProvider.ListAsJson(spec);
        return string.IsNullOrEmpty(detail) ? NotFound() : Ok(detail);*/
    }
    
    private Task<(long  TotalIssues, long Opened, long Closed)> GetWeekData(string locationPath, Instant since)
    {
        /*var spec = new IssueInLocationSpec(locationPath) & (new IssueStatusSpec(MaintenanceIssueStatus.Open));
        var detail = await queryProvider.ListAsJson(spec);
        return string.IsNullOrEmpty(detail) ? NotFound() : Ok(detail);*/
    }
    
    internal class MaintenanceIssueInPathSpec(string path): Specification<MaintenanceIssue>{
        public override bool IsSatisfiedBy(MaintenanceIssue item)
        {
            return item.CaptureInfo.CameraPath.StartsWith(path);
        }

        public override Expression<Func<MaintenanceIssue, bool>> ToExpression()
        {
            return item => item.CaptureInfo.CameraPath.StartsWith(path);
        }
    }
    
    internal class MyClass
    {
        
    }
}