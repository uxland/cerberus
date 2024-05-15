using System.Drawing;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;
using FFmpeg.AutoGen;
using RtspClientSharp.RawFrames;
using RtspClientSharp.RawFrames.Video;

namespace Cerverus.Core.RstpClient;

internal class H264Decoder : IFrameDecoder
{
    public bool CanDecodeFrame(RawFrame frame)
    {
        return frame is RawH264IFrame;
    }

    public byte[] DecodeFrame(RawFrame frame)
    {
        return this.DecodeH264Frame(frame as RawH264IFrame);
    }

    private unsafe byte[] DecodeH264Frame(RawH264IFrame frame)
    {
        var avFrame = DecodeFrame(frame);
        var bitmap = ConvertToBitmap(avFrame);
        return bitmap;
    }

    private static unsafe AVFrame* DecodeFrame(RawH264IFrame frame)
    {
        var buffer = new byte[frame.FrameSegment.Count + frame.SpsPpsSegment.Count];
        Array.Copy(frame.SpsPpsSegment.Array, frame.SpsPpsSegment.Offset, buffer, 0, frame.SpsPpsSegment.Count);
        Array.Copy(frame.FrameSegment.Array, frame.FrameSegment.Offset, buffer, frame.SpsPpsSegment.Count,
            frame.FrameSegment.Count);
        var codec = ffmpeg.avcodec_find_decoder(AVCodecID.AV_CODEC_ID_H264);
        if (codec == null)
            throw new Exception("Codec not found");
        var context = ffmpeg.avcodec_alloc_context3(codec);
        if (context == null)
            throw new Exception("Could not allocate codec context");
        if (ffmpeg.avcodec_open2(context, codec, null) < 0)
            throw new Exception("Could not open codec");
        var packet = ffmpeg.av_packet_alloc();
        if (packet == null)
            throw new Exception("Could not allocate packet");
        fixed (byte* ptr = buffer)
        {
            packet->data = ptr;
            packet->size = buffer.Length;

            var res = ffmpeg.avcodec_send_packet(context, packet);
            if (res < 0)
                throw new Exception("Error sending a packet for decoding");
            var fr = ffmpeg.av_frame_alloc();
            if (fr == null)
                throw new Exception("Could not allocate frame");
            if (ffmpeg.avcodec_receive_frame(context, fr) < 0)
            {
                throw new Exception("Error during decoding");
            }

            return fr;
        }
    }

    private static unsafe byte[] ConvertToBitmap(AVFrame* frame)
    {
        int width = frame->width;
        int height = frame->height;

        // Create a new bitmap
        Bitmap bitmap = new Bitmap(width, height, PixelFormat.Format24bppRgb);

        // Lock the bitmap's bits
        BitmapData bitmapData = bitmap.LockBits(new Rectangle(0, 0, width, height), ImageLockMode.WriteOnly,
            bitmap.PixelFormat);

        // Allocate a buffer for the converted frame
        byte* convertedFrameBuffer = (byte*)Marshal.AllocHGlobal(width * height * 3);

        // Create a frame for the converted data
        var convertedFrame = ffmpeg.av_frame_alloc();
        convertedFrame->format = (int)AVPixelFormat.AV_PIX_FMT_RGB24;
        convertedFrame->width = width;
        convertedFrame->height = height;
        var dataPtr = new byte_ptrArray4();
        var linesizePtr = new int_array4();
        ffmpeg.av_image_fill_arrays(ref dataPtr, ref linesizePtr, convertedFrameBuffer, AVPixelFormat.AV_PIX_FMT_RGB24,
            width, height, 1);
        // Copy data from dataPtr and linesizePtr to convertedFrame->data and convertedFrame->linesize
        for (uint i = 0; i < 4; i++)
        {
            convertedFrame->data[i] = dataPtr[i];
            convertedFrame->linesize[i] = linesizePtr[i];
        }

        // Create a conversion context
        var conversionContext = ffmpeg.sws_getContext(width, height, (AVPixelFormat)frame->format, width,
            height, AVPixelFormat.AV_PIX_FMT_RGB24, ffmpeg.SWS_BICUBIC, null, null, null);

        // Convert the frame
        ffmpeg.sws_scale(conversionContext, frame->data, frame->linesize, 0, height, convertedFrame->data,
            convertedFrame->linesize);

        // Copy the pixel data from the converted frame to the bitmap
        for (var y = 0; y < height; y++)
        {
            // Calculate the offset for the current line
            var lineOffset = y * bitmapData.Stride;

            // Get a pointer to the start of the line in the frame
            var line = &convertedFrame->data[0][y * convertedFrame->linesize[0]];

            // Copy the line to the bitmap
            for (var x = 0; x < width; x++)
            {
                // Calculate the offset for the current pixel
                var pixelOffset = lineOffset + x * 3;

                // Get a pointer to the start of the pixel in the frame
                var pixel = line + x * 3;

                // Copy the pixel to the bitmap
                ((byte*)bitmapData.Scan0)[pixelOffset + 0] = pixel[2]; // B
                ((byte*)bitmapData.Scan0)[pixelOffset + 1] = pixel[1]; // G
                ((byte*)bitmapData.Scan0)[pixelOffset + 2] = pixel[0]; // R
            }
        }

        // Unlock the bitmap's bits
        bitmap.UnlockBits(bitmapData);

        // Free the conversion context and the converted frame
        ffmpeg.sws_freeContext(conversionContext);
        ffmpeg.av_frame_free(&convertedFrame);
        Marshal.FreeHGlobal((IntPtr)convertedFrameBuffer);
        using var stream = new MemoryStream();
        bitmap.Save(stream, ImageFormat.Bmp);
        return stream.ToArray();
    }
}