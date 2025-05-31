namespace Cerberus.BackOffice.Features.OrganizationalStructure.Camera.Streaming.JoinStream;

public static class Handler
{
    public static async Task<JoinStreamResponse> Handle(OrganizationalStructure.Camera.JoinStream.JoinStream command, IStreamRegistry streamRegistry)
    {
        var response = await streamRegistry.StartStreamAsync(command.CameraId);
        return new JoinStreamResponse(response.StreamUrl);
    }
}