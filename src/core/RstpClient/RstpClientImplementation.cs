using System.Net;
using System.Runtime.CompilerServices;
using System.Security.Authentication;
using Cerverus.Features.Features.Captures;
using Cerverus.Features.Features.Captures.CaptureSnapshots;
using Microsoft.Extensions.Logging;
using RtspClientSharp;
using RtspClientSharp.RawFrames;


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
    

    public async Task<(byte[]? Buffer, CaptureError? Error)> CaptureSnapshot(CaptureSnapshotArguments arguments, CancellationToken cancellationToken = default)
    {
        this._framesToCapture = arguments.FramesToCapture;
        try
        {
            using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            cts.CancelAfter(TimeSpan.FromDays(45));
            using var client = CreateClient(arguments);
            await this.Connect(client, cts.Token);
            this._semaphore.WaitOne(TimeSpan.FromSeconds(45));
            return this.CreateResponse();
        }
        catch (Exception e)
        {
            this._logger.LogError($"Error capturing snapshot from {arguments.Address}: {e.Message}");
            return (null, new CaptureError(e.Message, CaptureErrorType.UnknownError));
        }
    }
    
    private RtspClient CreateClient(CaptureSnapshotArguments arguments)
    {
        var (address, username, password, _) = arguments;
        var credentials = new NetworkCredential(username, password);
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
        if(decoder == null)
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
    
    private async Task Connect(RtspClient client, CancellationToken cancellationToken)
    {
        while (true)
        {
            try
            {
                await client.ConnectAsync(cancellationToken);
            }
            catch (InvalidCredentialException)
            {
                this._logger.LogError($"Invalid credentials for server {client.ConnectionParameters.ConnectionUri}");
                throw;
            }

            try
            {
                await client.ReceiveAsync(cancellationToken);
            }
            catch (Exception e)
            {
                this._logger.LogError("Error Receiving from server {Server}: {Message}", client.ConnectionParameters.ConnectionUri, e.Message);
            }

            await Task.Delay(TimeSpan.FromMilliseconds(500), cancellationToken);
        }
    }
    
}