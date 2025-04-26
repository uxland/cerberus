using System.Text.Json;

namespace Cerberus.Signaling.Api.Entities;

using System.Diagnostics;

public class CameraStream(string cameraId, CameraConfig config)
{
    private readonly HashSet<string> _clients = new();
    private Process? _workerProcess;
    private StreamWriter? _stdin;
    private Task? _readerTask;
    private readonly Dictionary<string, TaskCompletionSource<string>> _pendingAnswers = new();

    public bool IsRunning => _workerProcess != null && !_workerProcess.HasExited;
    public bool HasClients => _clients.Count > 0;

    public void AddClient(string connectionId) => _clients.Add(connectionId);
    public void RemoveClient(string connectionId) => _clients.Remove(connectionId);

    public async Task StartAsync()
    {
        _workerProcess = new Process
        {
            StartInfo = new ProcessStartInfo
            {
                FileName = "python3",
                Arguments = $"webrtcbin_worker.py \"{config.TransportType}\" \"{config.Codec}\" \"{config.Url}\"", // must be in working directory
                RedirectStandardInput = true,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            }
        };

        _workerProcess.Start();
        _stdin = _workerProcess.StandardInput;
        _readerTask = Task.Run(() => ReadStdoutAsync(_workerProcess.StandardOutput));
        _ = Task.Run(() => LogOutput(_workerProcess.StandardError));

        await Task.CompletedTask;
    }

    public void Stop()
    {
        if (_workerProcess != null && !_workerProcess.HasExited)
        {
            _workerProcess.Kill();
        }
    }

    private async Task ReadStdoutAsync(StreamReader stdout)
    {
        while (!stdout.EndOfStream)
        {
            var line = await stdout.ReadLineAsync();
            if (line == null) continue;

            var msg = JsonSerializer.Deserialize<Dictionary<string, object>>(line);
            if (msg == null || !msg.ContainsKey("type")) continue;

            switch (msg["type"]?.ToString())
            {
                case "sdp-answer":
                    foreach (var tcs in _pendingAnswers.Values)
                        tcs.TrySetResult(msg["sdp"]?.ToString() ?? "");
                    _pendingAnswers.Clear();
                    break;

                case "ice-candidate":
                    // TODO: forward to React client(s)
                    break;
            }
        }
    }

    private void LogOutput(StreamReader reader)
    {
        while (!reader.EndOfStream)
            Console.WriteLine(reader.ReadLine());
    }

    public async Task<string> HandleOfferAsync(string connectionId, string sdpOffer)
    {
        if (_stdin == null) throw new InvalidOperationException("Worker not running");
        var payload = new
        {
            type = "sdp-offer",
            sdp = sdpOffer
        };

        var json = JsonSerializer.Serialize(payload);
        var tcs = new TaskCompletionSource<string>();
        _pendingAnswers[connectionId] = tcs;
        await _stdin.WriteLineAsync(json);
        await _stdin.FlushAsync();
        return await tcs.Task;
    }

    public async Task HandleIceCandidate(string connectionId, string candidate)
    {
        if (_stdin == null) return;

        var payload = new
        {
            type = "ice-candidate",
            candidate = candidate,
            sdpMLineIndex = 0
        };

        var json = JsonSerializer.Serialize(payload);
        await _stdin.WriteLineAsync(json);
        await _stdin.FlushAsync();
    }

    private string BuildPipeline(CameraConfig config)
    {
        return ""; // handled in Python for now
    }
}