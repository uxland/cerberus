using System.Net;
using System.Security.Authentication;
using Cerverus.Features.Features.Captures;
using Cerverus.Features.Features.Captures.CaptureSnapshots;
using Microsoft.Extensions.Logging;
using RtspClientSharp;
using RtspClientSharp.RawFrames.Video;


namespace Cerverus.Core.RstpClient;

public class RstpClientImplementation(ILogger<RstpClientImplementation> logger): ISnapshotCatcher
{
    public async Task<(Stream? stream, CaptureError? Error)> CaptureSnapshot(string address, string username, string password, CancellationToken cancellationToken = default)
    {
        try
        {
            var credentials = new NetworkCredential(username, password);
            var serverUri = new Uri("rtsp://ip_adx/cam1/h264");//new Uri($"rtsp://{address}:554/ucast/11");
            var connectionParams = new ConnectionParameters(serverUri, credentials);
            connectionParams.RtpTransport = RtpTransportProtocol.TCP;
            var semaphore = new ManualResetEvent(false);
            Stream? stream = null;
            using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            cts.CancelAfter(TimeSpan.FromSeconds(45));
            using var client = new RtspClient(connectionParams);
            client.FrameReceived += (sender, frame) =>
            {
                switch (frame)
                {
                    case RawJpegFrame jpegFrame:
                        stream = new MemoryStream(jpegFrame.FrameSegment.Array, jpegFrame.FrameSegment.Offset, jpegFrame.FrameSegment.Count);
                        semaphore.Set();
                        break;
                }
            };
            await this.Connect(client, cts.Token);
            semaphore.WaitOne(TimeSpan.FromSeconds(45));
            return stream == null ? (null, new CaptureError("Unknown error", CaptureErrorType.UnknownError)) : (stream, null);
        }
        catch (Exception e)
        {
            logger.LogError($"Error capturing snapshot from {address}: {e.Message}");
            return (null, new CaptureError(e.Message, CaptureErrorType.UnknownError));
        }
    }
    
    private async Task Connect(RtspClient client, CancellationToken cancellationToken)
    {
        while (true)
        {
            try
            {
                await client.ConnectAsync(cancellationToken);
            }
            catch (InvalidCredentialException e)
            {
                logger.LogError($"Invalid credentials for server {client.ConnectionParameters.ConnectionUri}");
                throw;
            }

            try
            {
                await client.ReceiveAsync(cancellationToken);
            }
            catch (Exception e)
            {
                logger.LogError("Error Receiving from server {Server}: {Message}", client.ConnectionParameters.ConnectionUri, e.Message);
            }
        }
    }
    
}