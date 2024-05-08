
namespace Cerverus.Features.Features.OrganizationalStructure.Location;



public record CameraAdminSettings(
    string? IpAddress,
    CameraCredentials? Credentials,
    string? CaptureRecurrencePattern
)
{
    public CameraAdminSettings Merge(CameraAdminSettings other)
    {
        return this with
        {
            IpAddress = !string.IsNullOrEmpty(other.IpAddress) ? other.IpAddress : this.IpAddress,
            Credentials = other.Credentials ?? this.Credentials,
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
    public CameraFunctionalSettings Merge(CameraFunctionalSettings other)
    {
        var filters = this.Filters.ToDictionary(c => c.Id, c => c);
        other.Filters.ForEach(f => filters[f.Id] = f);
        
        return new CameraFunctionalSettings(
            filters.Values.ToList()
        );
    }
}