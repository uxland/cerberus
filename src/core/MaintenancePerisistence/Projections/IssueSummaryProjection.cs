using Cerverus.Features.Features.OrganizationalStructure.Camera;
using Cerverus.Maintenance.Features.Features.Issues;
using Cerverus.Maintenance.Features.Features.Issues.ListByLocationPath;
using Marten;
using Marten.Events;
using Marten.Events.Aggregation;

namespace Cerverus.Maintenance.Persistence.Projections;

public class IssueSummaryProjection: SingleStreamProjection<MaintenanceIssueSummary>
{
    public IssueSummaryProjection()
    {
        DeleteEvent<MaintenanceIssueEnded>();
    }
    public async Task<MaintenanceIssueSummary> Create(IEvent<MaintenanceIssueCreated> e, IQuerySession querySession)
    {
        var camera = await querySession.LoadAsync<Camera>(e.Data.CaptureInfo.CameraId);
        return new MaintenanceIssueSummary(
            Id: e.StreamKey!,
            Path: camera!.Path,
            CameraId: camera!.Id,
            Description: camera.Description,
            e.Data.Status
        );
    }
}