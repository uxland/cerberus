using System.Net;
using System.Runtime.CompilerServices;
using System.Security.Authentication;
using Cerverus.Features.Features.Captures;
using Cerverus.Features.Features.Captures.CaptureSnapshots;
using Microsoft.Extensions.Logging;
using RtspClientSharp;
using RtspClientSharp.RawFrames;
using RtspClientSharp.Rtsp;


namespace Cerverus.Core.RstpClient;

public class RstpClientImplementation: ISnapshotCatcher
{private RtspClient? _client;
    private int _captureCount;
    private  uint _framesToCapture;
    private readonly EventHandler<RawFrame> _onFrameReceivedHandler;
    private readonly IList<IFrameDecoder> _decoders;
    private readonly ILogger<RstpClientImplementation> _logger;
    private readonly ManualResetEvent _semaphore = new(false);
    private byte[]? _buffer;
    public RstpClientImplementation(ILogger<RstpClientImplementation> logger)
    {
        _decoders = FrameDecodersFactory.GetDecoders();
        this._logger = logger;
        this._onFrameReceivedHandler = this.OnFrameReceived;
    }
    

    public Task<(byte[]? Buffer, CaptureError? Error)> CaptureSnapshot(CaptureSnapshotArguments arguments, CancellationToken cancellationToken = default)
    {
        this._framesToCapture = arguments.FramesToCapture;
        return Task.Run(async () =>
        {
            try
            {
                using var client = CreateClient(arguments);
                var error = await this.Connect(client, cancellationToken);
                if (error != null)
                    return (null, error);
                client.ReceiveAsync(cancellationToken);
                this._semaphore.WaitOne(TimeSpan.FromSeconds(5));
                return this.CreateResponse();
            }
            catch (Exception e)
            {
                this._logger.LogError($"Error capturing snapshot from {arguments.Address}: {e.Message}");
                return (null, new CaptureError(e.Message, CaptureErrorType.UnknownError));
            }
        }, cancellationToken);

    }
    
    private RtspClient CreateClient(CaptureSnapshotArguments arguments)
    {
        var (address, username, password, _) = arguments;
        var credentials = new NetworkCredential("admin", "-Videologic99"); //new NetworkCredential(username, password);
        var serverUri = new Uri($"rtsp://192.168.1.64:554/stream");
        var connectionParams = new ConnectionParameters(serverUri, credentials)
        {
            RtpTransport = RtpTransportProtocol.TCP
        };
        var client = new RtspClient(connectionParams);
        client.FrameReceived += this._onFrameReceivedHandler;
        this._client = client;
        return client;
    }
    
    private void OnFrameReceived(object? sender, RawFrame frame)
    {
        var decoder = this._decoders.FirstOrDefault(d => d.CanDecodeFrame(frame));
        if(decoder == null || this._captureCount >= this._framesToCapture)
            return;
        this._captureCount++;
        if(this._captureCount >= this._framesToCapture)
            this._client!.FrameReceived -= this._onFrameReceivedHandler;
        var buffer = decoder.DecodeFrame(frame);
        this._buffer = buffer;
        if (this._captureCount >= this._framesToCapture)
            this._semaphore.Set();
    }

    private (byte[]? Buffer, CaptureError? Error) CreateResponse()
    {
        if(this._buffer == null || this._buffer.LongLength == 0)
            return (null, new CaptureError("Unknown error", CaptureErrorType.UnknownError));
        return (this._buffer, null);
    }
    
    private async Task<CaptureError?> Connect(RtspClient client, CancellationToken cancellationToken)
    {
        using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        cts.CancelAfter(TimeSpan.FromSeconds(5));
        CaptureError? lastError = null;
        while (!cts.IsCancellationRequested)
        {
            try
            {
                await client.ConnectAsync(cancellationToken);
                return null;
            }
            catch (InvalidCredentialException)
            {
                this._logger.LogError("Invalid credentials for server {CameraUrl}",
                    client.ConnectionParameters.ConnectionUri);
                return new CaptureError($"Invalid credentials for server {client.ConnectionParameters.ConnectionUri}",
                    CaptureErrorType.AuthenticationError);
            }
            catch (RtspClientException e)
            {
                lastError = new CaptureError(e.Message, CaptureErrorType.ConnectionError);
            }
            
            await Task.Delay(TimeSpan.FromMilliseconds(500), cancellationToken);
        }

        return lastError ?? new CaptureError("Connection timeout", CaptureErrorType.ConnectionTimeout);
    }
    
}