using Cerberus.Core.Domain;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run;

public partial class SurveillanceRun() : AggregateRoot()
{
    public string RoundId { get; private set; }

    public string RootLocationId { get; private set; }
    
    public string? AssignedGroupId { get; private set; }

    public string? ExecutorId { get; private set; }

    public Instant? StartedAt { get; private set; }

    public Instant? EndedAt { get; private set; }

    public RunStatus Status { get; private set; }
    
    public IEnumerable<InspectionRun> InspectionRuns { get; private set; }

    public string? CurrentInspectionRunId { get; private set; }

    
}