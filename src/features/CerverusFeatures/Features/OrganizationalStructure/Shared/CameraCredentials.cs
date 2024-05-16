namespace Cerverus.Features.Features.OrganizationalStructure.Shared;

public record CameraCredentials(
    string Username = "",
    string Password = ""
)
{
    public CameraCredentials Merge(CameraCredentials? other)
    {
        if(other == null)
            return this;
        return this with
        {
            Username = !string.IsNullOrEmpty(other.Username) ? other.Username : this.Username,
            Password = !string.IsNullOrEmpty(other.Password) ? other.Password : this.Password
        };
    }
}