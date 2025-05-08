using Cerberus.BackOffice.Features.OrganizationalStructure.Camera.Streaming.JoinStream;
using Cerberus.Core.Domain;

namespace Cerberus.BackOffice.Features.OrganizationalStructure.Camera.JoinStream;

public record JoinStream(string CameraId) : ICommand<JoinStreamResponse>
{
    public string CameraId { get; } = CameraId;
}