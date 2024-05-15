using System.Drawing;
using FFmpeg.AutoGen;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

namespace Cerverus.Core.RstpClient;

public class H264DecoderJj
{

    public H264DecoderJj()
    {
    }

    public void SaveSnapshot(byte[] buffer, string path)
    {
        unsafe
        {
            // ffmpeg.avdevice_register_all();
            FFmpegBinariesHelper.RegisterFFmpegBinaries();
            FFmpeg.AutoGen.Bindings.DynamicallyLoaded.DynamicallyLoadedBindings.Initialize();
            ffmpeg.avdevice_register_all();
            var codecId = AVCodecID.AV_CODEC_ID_H264;
            var _pCodec = ffmpeg.avcodec_find_encoder(codecId);
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
            }

            /*if (ffmpeg.avcodec_send_packet(context, packet) < 0)
                throw new Exception("Error sending a packet for decoding");*/
            var res = ffmpeg.avcodec_send_packet(context, packet);
            var frame = ffmpeg.av_frame_alloc();
            if (frame == null)
                throw new Exception("Could not allocate frame");
            if (ffmpeg.avcodec_receive_frame(context, frame) < 0)
            {
                throw new Exception("Error during decoding");
            }

            // Convert the frame to a bitmap
            var bitmap = ConvertFrameToBitmap(frame);
            using var file = File.OpenWrite(path);
            bitmap.Save(file, ImageFormat.Jpeg);
        }
    }

    public static unsafe Bitmap ConvertFrameToBitmap(AVFrame* frame)
{
    // Get the width and height of the frame
    int width = frame->width;
    int height = frame->height;

    // Create a new bitmap
    Bitmap bitmap = new Bitmap(width, height, PixelFormat.Format24bppRgb);

    // Lock the bitmap's bits
    BitmapData bitmapData = bitmap.LockBits(new Rectangle(0, 0, width, height), ImageLockMode.WriteOnly, bitmap.PixelFormat);

    // Allocate a buffer for the converted frame
    byte* convertedFrameBuffer = (byte*)Marshal.AllocHGlobal(width * height * 3);

    // Create a frame for the converted data
    AVFrame* convertedFrame = ffmpeg.av_frame_alloc();
    convertedFrame->format = (int)AVPixelFormat.AV_PIX_FMT_RGB24;
    convertedFrame->width = width;
    convertedFrame->height = height;
    byte_ptrArray4 dataPtr = new byte_ptrArray4();
    int_array4 linesizePtr = new int_array4();
    ffmpeg.av_image_fill_arrays(ref dataPtr, ref linesizePtr, convertedFrameBuffer, AVPixelFormat.AV_PIX_FMT_RGB24, width, height, 1);
    // Copy data from dataPtr and linesizePtr to convertedFrame->data and convertedFrame->linesize
    for (uint i = 0; i < 4; i++)
    {
        convertedFrame->data[i] = dataPtr[i];
        convertedFrame->linesize[i] = linesizePtr[i];
    }

    // Create a conversion context
    SwsContext* conversionContext = ffmpeg.sws_getContext(width, height, (AVPixelFormat)frame->format, width, height, AVPixelFormat.AV_PIX_FMT_RGB24, ffmpeg.SWS_BICUBIC, null, null, null);

    // Convert the frame
    ffmpeg.sws_scale(conversionContext, frame->data, frame->linesize, 0, height, convertedFrame->data, convertedFrame->linesize);

    // Copy the pixel data from the converted frame to the bitmap
    for (int y = 0; y < height; y++)
    {
        // Calculate the offset for the current line
        int lineOffset = y * bitmapData.Stride;

        // Get a pointer to the start of the line in the frame
        byte* line = &convertedFrame->data[0][y * convertedFrame->linesize[0]];

        // Copy the line to the bitmap
        for (int x = 0; x < width; x++)
        {
            // Calculate the offset for the current pixel
            int pixelOffset = lineOffset + x * 3;

            // Get a pointer to the start of the pixel in the frame
            byte* pixel = line + x * 3;

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

    return bitmap;
}
}
