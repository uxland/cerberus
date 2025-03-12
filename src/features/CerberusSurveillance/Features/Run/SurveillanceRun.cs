using Cerberus.Core.Domain;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run;

public partial class SurveillanceRun() : AggregateRoot()
{
    public string RoundId { get; set; }

    public string RootLocationId { get; set; }
    
    public string? AssignedGroupId { get; set; }

    public string? ExecutorId { get; set; }

    public Instant? StartedAt { get;  set; }

    public Instant? EndedAt { get; set; }

    public RunStatus Status { get; set; }
    
    public IEnumerable<InspectionRun> InspectionRuns { get; set; }

    public string? CurrentInspectionRunId { get; set; }

    
}