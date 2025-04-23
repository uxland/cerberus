using Cerberus.Signaling.Api.Entities;

namespace Cerberus.Signaling.Api.Services;

public class CameraConfigService
{
    public CameraConfig GetCameraConfig(string cameraId)
    {
        // TODO: Replace with secure call to Backoffice DB or API
        return new CameraConfig
        (
            Url: "rtsp://test:Test2025@80.37.229.214:39887/Streaming/Channels/102?transportmode=unicast",
            Codec: CameraStreamCodec.H265,
            TransportType: CameraTransportType.Rtsp
        );
    }
}
