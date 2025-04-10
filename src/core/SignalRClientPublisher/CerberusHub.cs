using Cerberus.Core.Domain;
using Microsoft.AspNetCore.SignalR;

namespace SignalRClientPublisher;

public class CerberusHub(IUserContextProvider userContextProvider): Hub
{
    public override async Task OnConnectedAsync()
    {
        var user = userContextProvider.CurrentUser;
        await Groups.AddToGroupAsync(Context.ConnectionId, "*");
        foreach (var group in user.MemberOf)
            await Groups.AddToGroupAsync(Context.ConnectionId,  group);
        await base.OnConnectedAsync();
    }
}

internal class SignalRPublisher(IHubContext<CerberusHub> hub): IClientPublisher
{

    public Task PublishAsync<T>(string group, string topic, T message)
    {
    //    hub.Clients.All.SendAsync(topic, message);
        var clientGroup = hub.Clients.Group(group);
        var task = clientGroup.SendAsync(topic, message);
        return task;
    }
}