using Cerberus.Core.Domain;
using Cerberus.Core.Domain.Errors;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run;

public partial class SurveillanceRun() : AggregateRoot()
{
    public string RoundId { get; set; }

    public string RootLocationId { get; set; }
    
    public string? AssignedGroupId { get; set; }

    public string? StartedBy { get; set; }

    public Instant? StartedAt { get;  set; }

    public string? EndedBy { get; set; }
    
    public Instant? EndedAt { get; set; }

    public RunStatus Status { get; set; }
    
    public IEnumerable<InspectionRun> InspectionRuns { get; set; }

    public string? CurrentInspectionRunId { get; set; }
    
    public string? AdditionalNotes { get; set; }
    
    private InspectionRun? GetInspectionRunById(string inspectionId) => this.InspectionRuns.FirstOrDefault(x => x.Id == inspectionId);
    
    private InspectionRun GetInspectionRunByIdOrFail(string inspectionId) => this.GetInspectionRunById(inspectionId) ?? throw new EntityNotFoundException(typeof(InspectionRun), inspectionId);
    
    public bool CanStart() => this.Status == RunStatus.Pending;

    public bool CanRelease => this.Status == RunStatus.Running && this.AreAllInspectionsCompleted();


    private bool AreAllInspectionsCompleted() => this.InspectionRuns.All(x => x.Status == RunStatus.Completed || x.Status == RunStatus.Dismissed);
    
}