
namespace Cerberus.BackOffice.Features.OrganizationalStructure.Shared;
public record CameraAdminSettings(
    string? IpAddress = null,
    CameraCredentials? Credentials = null,
    string? CaptureRecurrencePattern = null
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

public record CameraFilter(
    string Id,
    string? JsonArguments
);

public record CameraFunctionalSettings(
    List<CameraFilter> Filters
)
{
    public CameraFunctionalSettings Merge(CameraFunctionalSettings? other)
    {
        if(other == null)
            return this;
        var filters = this.Filters.ToDictionary(c => c.Id, c => c);
        other.Filters.ForEach(f => filters[f.Id] = f);
        
        return new CameraFunctionalSettings(
            filters.Values.ToList()
        );
    }
}