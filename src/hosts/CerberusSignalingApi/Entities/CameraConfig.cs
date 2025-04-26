namespace Cerberus.Signaling.Api.Entities;

public enum CameraTransportType
{
    Rtsp,
    File,
}
public enum CameraStreamCodec
{
    H264,
    H265,
    Mpeg4,
}

public record CameraConfig(string Url, CameraStreamCodec Codec, CameraTransportType TransportType);