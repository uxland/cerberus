using Cerberus.Signaling.Api.Services;
using Microsoft.AspNetCore.SignalR;

namespace Cerberus.Signaling.Api;

public class WebRtcSignalingHub(StreamManager streamManager) : Hub
{
    public async Task SendOffer(string cameraId, string sdpOffer)
    {
        var sdpAnswer = await streamManager.HandleOfferAsync(cameraId, Context.ConnectionId, sdpOffer);
        await Clients.Caller.SendAsync("ReceiveAnswer", sdpAnswer);
    }

    public async Task SendIceCandidate(string cameraId, string candidate)
    {
        await streamManager.HandleIceCandidate(cameraId, Context.ConnectionId, candidate);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        streamManager.RemoveClient(Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }
}