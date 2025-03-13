namespace Cerberus.Surveillance.Features.Features.Run;

public partial class InspectionRun
{
    public InspectionRun(string id, string inspectionId, string cameraId, string cameraDescription, string cameraStreamingUrl, OperationRun operationRun): this()
    {
        this.Id = id;
        this.InspectionId = inspectionId;
        this.CameraId = cameraId;
        this.CameraDescription = cameraDescription;
        this.CameraStreamingUrl = cameraStreamingUrl;
        this.OperationRun = operationRun;
        this.Status = RunStatus.Pending;
    }
}