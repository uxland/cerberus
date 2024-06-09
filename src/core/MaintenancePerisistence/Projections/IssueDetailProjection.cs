using Cerverus.BackOffice.Features.OrganizationalStructure.Camera;
using Cerverus.Maintenance.Features.Features.Issues;
using Cerverus.Maintenance.Features.Features.Issues.GetDetail;
using Marten;
using Marten.Events;
using Marten.Events.Aggregation;

namespace Cerverus.Maintenance.Persistence.Projections;

public class IssueDetailProjection: SingleStreamProjection<MaintenanceIssueDetail>
{
    public async Task<MaintenanceIssueDetail> Create(IEvent<MaintenanceIssueCreated> e, IQuerySession querySession)
    {
        var camera = await querySession.LoadAsync<Camera>(e.Data.CaptureInfo.CameraId);
        return new MaintenanceIssueDetail(
            Id: e.StreamKey!,
            SnapshotUrl: e.Data.CaptureInfo.SnapshotUri,
            CameraId: camera!.Id,
            CameraPath: camera.Path,
            CameraDescription: camera.Description,
            CaptureError: e.Data.CaptureError,
            Errors: e.Data.Errors,
            e.Data.Status
        );
    }
}