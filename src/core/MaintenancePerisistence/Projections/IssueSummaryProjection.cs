using Cerberus.BackOffice.Features.OrganizationalStructure.Camera;
using Cerberus.Maintenance.Features.Features.Issues;
using Cerberus.Maintenance.Features.Features.Issues.ListByLocationPath;
using Marten;
using Marten.Events;
using Marten.Events.Aggregation;

namespace Cerberus.Maintenance.Persistence.Projections;

public class IssueSummaryProjection: SingleStreamProjection<PendingMaintenanceIssueSummary>
{
    public IssueSummaryProjection()
    {
        DeleteEvent<MaintenanceIssueEnded>();
    }
    public async Task<PendingMaintenanceIssueSummary> Create(IEvent<MaintenanceIssueCreated> e, IQuerySession querySession)
    {
        var camera = await querySession.LoadAsync<Camera>(e.Data.CaptureInfo.CameraId);
        var description = querySession.GetCameraPathDescription(e.Data.CaptureInfo.CameraPath);
        return new PendingMaintenanceIssueSummary(
            Id: e.StreamKey!,
            Path: camera!.Path,
            CameraId: camera!.Id,
            Description: description,
            Summary:e.Data.GetIssueSummary(),
            e.Data.Status,
            e.Data.Creation.At
        );
    }
}