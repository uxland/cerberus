using Cerverus.Features.Features.OrganizationalStructure.Camera;
using MediatR;

namespace Cerverus.Features.Features.Captures.CaptureSnapshots;

public class Handler(ICameraQueryProvider cameraQueryProvider): IRequestHandler<CaptureCameraSnapshot>
{
    public async Task Handle(CaptureCameraSnapshot request, CancellationToken cancellationToken)
    {
        var camera = await cameraQueryProvider.Rehydrate(request.Id);
        if(camera == null)
            return;
        
    }
}