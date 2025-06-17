using Cerberus.BackOffice.Features.OrganizationalStructure.Camera;
using Cerberus.Maintenance.Features.Features.Issues;
using Cerberus.Maintenance.Features.Features.Issues.GetDetail;
using JasperFx.Events;
using Marten;
using Marten.Events;
using Marten.Events.Aggregation;

namespace Cerberus.Maintenance.Persistence.Projections;

public class IssueDetailProjection: SingleStreamProjection<MaintenanceIssueDetail, string>
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