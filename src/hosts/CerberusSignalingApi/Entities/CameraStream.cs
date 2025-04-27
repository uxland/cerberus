using System.Diagnostics;

namespace Cerberus.Signaling.Api.Entities;

public class CameraStream
{
    private readonly ILogger<CameraStream> _logger;
    private Process? _process;
    private StreamWriter? _stdin;

    public CameraStream(ILogger<CameraStream> logger)
    {
        _logger = logger;
    }

    public async Task StartAsync(string cameraId)
    {
        _logger.LogInformation("Starting Python worker for camera {CameraId}", cameraId);

        var startInfo = new ProcessStartInfo
        {
            FileName = "python3",
            Arguments = "webrtcbin_worker.py",
            RedirectStandardInput = true,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false,
            CreateNoWindow = true,
            WorkingDirectory = "/app"
        };

        _process = new Process { StartInfo = startInfo };
        _process.Start();
        _stdin = _process.StandardInput;

        _ = Task.Run(async () =>
        {
            while (!_process.StandardOutput.EndOfStream)
            {
                var line = await _process.StandardOutput.ReadLineAsync();
                if (!string.IsNullOrWhiteSpace(line))
                {
                    _logger.LogInformation("📥 Python Output: {Line}", line);
                }
            }
        });

        _ = Task.Run(async () =>
        {
            while (!_process.StandardError.EndOfStream)
            {
                var error = await _process.StandardError.ReadLineAsync();
                if (!string.IsNullOrWhiteSpace(error))
                {
                    _logger.LogWarning("⚠️ Python Error: {Error}", error);
                }
            }
        });
    }

    public async Task SendOfferAsync(string sdpOffer)
    {
        if (_stdin == null)
        {
            _logger.LogError("❌ Cannot send SDP offer. Stdin is null.");
            return;
        }

        var message = new
        {
            type = "sdp-offer",
            sdp = sdpOffer
        };

        var json = System.Text.Json.JsonSerializer.Serialize(message);
        await _stdin.WriteLineAsync(json);
        await _stdin.FlushAsync();

        _logger.LogInformation("📤 Sent SDP Offer to Python worker.");
    }

    public async Task SendIceCandidateAsync(string candidate)
    {
        if (_stdin == null)
        {
            _logger.LogError("❌ Cannot send ICE candidate. Stdin is null.");
            return;
        }

        var message = new
        {
            type = "ice-candidate",
            candidate = candidate,
            sdpMLineIndex = 0
        };

        var json = System.Text.Json.JsonSerializer.Serialize(message);
        await _stdin.WriteLineAsync(json);
        await _stdin.FlushAsync();

        _logger.LogInformation("📤 Sent ICE Candidate to Python worker.");
    }

    public void Kill()
    {
        try
        {
            if (_process != null && !_process.HasExited)
            {
                _logger.LogInformation("🛑 Killing Python worker process.");
                _process.Kill();
                _process.Dispose();
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "⚠️ Failed to kill Python worker process");
        }
    }
}