namespace Cerverus.UI.Infrastructure;

public class LocationStructureUploader(ApiClient client)
{
    public Task UploadLocationStructure(byte[] buffer,  string fileName)
    {
        return client.PostFile("locations", buffer, fileName);
    }
}