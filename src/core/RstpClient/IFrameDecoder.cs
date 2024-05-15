using RtspClientSharp.RawFrames;

namespace Cerverus.Core.RstpClient;

public interface IFrameDecoder
{
    bool CanDecodeFrame(RawFrame frame);
    byte[] DecodeFrame(RawFrame frame);
}

public static class FrameDecodersFactory
{
    public static List<IFrameDecoder> GetDecoders()
    {
        return new List<IFrameDecoder>
        {
            new H264Decoder()
        };
    }
}