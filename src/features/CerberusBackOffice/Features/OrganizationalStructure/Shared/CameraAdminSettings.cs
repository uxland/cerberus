
namespace Cerberus.BackOffice.Features.OrganizationalStructure.Shared;
public record CameraAdminSettings(
    string? IpAddress = null,
    CameraCredentials? Credentials = null,
    string CaptureRecurrencePattern = "*/5 * * * *"
)
{
    public CameraAdminSettings Merge(CameraAdminSettings? other)
    {
        if(other == null)
            return this;
        return this with
        {
            IpAddress = !string.IsNullOrEmpty(other.IpAddress) ? other.IpAddress : this.IpAddress,
            Credentials = new CameraCredentials().Merge(other.Credentials).Merge(this.Credentials),
            CaptureRecurrencePattern = !string.IsNullOrEmpty(other.CaptureRecurrencePattern)
                ? other.CaptureRecurrencePattern
                : this.CaptureRecurrencePattern
        };
    }

}