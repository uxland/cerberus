using Cerverus.Core.Domain;
using Cerverus.Features.Features.Captures.CaptureSnapshots;

namespace Cerverus.Features.Features.Captures.GetCameraThumbnails;

public record CameraThumbnails(
    string Id,
    HashSet<string> Thumbnails) : IEntity
{
    public CameraThumbnails Apply(SnapshotCaptured @event)
    {
        return string.IsNullOrEmpty(@event.Settings.ThumbnailPath) ? this : this with
        {
            Thumbnails = new HashSet<string>(Thumbnails)
            {
                @event.Settings.ThumbnailPath!
            }
        };
    }
}

public interface ICameraThumbnailsEntityQueryProvider : IEntityQueryProvider<CameraThumbnails>
{
    
}