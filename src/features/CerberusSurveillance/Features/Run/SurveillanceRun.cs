using Cerberus.Core.Domain;
using Cerberus.Core.Domain.Errors;
using NodaTime;
using UnauthorizedAccessException = Cerberus.Core.Domain.Errors.UnauthorizedAccessException;

namespace Cerberus.Surveillance.Features.Features.Run;

public partial class SurveillanceRun() : AggregateRoot()
{
    private static readonly RunStatus[] EndedStatuses = { RunStatus.Released, RunStatus.Dismissed, RunStatus.Cancelled };
    public string RoundId { get; set; }

    public string RootLocationId { get; set; }
    
    public string? AssignedGroupId { get; set; }

    public string? StartedBy { get; set; }

    public Instant? StartedAt { get;  set; }
    
    public Instant? LastActivityAt { get; set; }
    
    public string? LastActivityBy { get; set; }
    
    public Instant? ClaimedAt { get; set; }
    public string? ClaimedBy { get; set; }

    public string? EndedBy { get; set; }
    
    public Instant? EndedAt { get; set; }
    
    public Instant PlannedAt { get; set; }

    public RunStatus Status { get; set; }
    
    public IEnumerable<InspectionRun> InspectionRuns { get; set; }

    public string? CurrentInspectionRunId { get; set; }
    
    public string? AdditionalNotes { get; set; }
    
    public bool IsStarted() => this.StartedAt != null;
    
    private InspectionRun? GetInspectionRunById(string inspectionId) => this.InspectionRuns.FirstOrDefault(x => x.Id == inspectionId);
    
    private InspectionRun GetInspectionRunByIdOrFail(string inspectionId) => this.GetInspectionRunById(inspectionId) ?? throw new EntityNotFoundException(typeof(InspectionRun), inspectionId);
    
    public bool CanStart() => this.Status == RunStatus.Pending;

    public bool CanRelease =>this.AreAllInspectionsCompleted();


    private bool AreAllInspectionsCompleted() => this.InspectionRuns.All(x => x.Status == RunStatus.Completed || x.Status == RunStatus.Dismissed);

    private void ValidateOwnerShip(string userId)
    {
        if(!string.IsNullOrWhiteSpace(this.ClaimedBy) && this.ClaimedBy != userId)
            throw new UnauthorizedAccessException($"Run is already claimed by {this.ClaimedBy}");
    }
}