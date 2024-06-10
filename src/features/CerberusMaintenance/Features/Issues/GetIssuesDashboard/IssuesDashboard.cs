using NodaTime;

namespace Cerberus.Maintenance.Features.Features.Issues.GetIssuesDashboard;
public record WeekData(
    long TotalIssues,
    long TotalIIssuesLastWeek,
    long TotalIssuesOpen,
    long TotalIssuesOpenLastWeek,
    long TotalIssuesInCourse,
    long TotalIssuesClosed,
    long TotalIssuesClosedLastWeek
    );

public record ChartItem(
    LocalDate Date,
    long TotalIssues,
    long TotalIssuesOpen,
    long TotalIssuesClosed
    );

public record IssuesDashboard(
    string LocationPath,
    long TotalIssues,
    long TotalIssuesOpen,
    long TotalIssuesInCourse,
    WeekData WeekData,
    List<ChartItem> ChartItems
    );