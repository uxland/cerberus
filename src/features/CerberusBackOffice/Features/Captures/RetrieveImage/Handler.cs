using Cerberus.BackOffice.Features.Captures.CaptureSnapshots;
using Microsoft.Extensions.Options;

namespace Cerberus.BackOffice.Features.Captures.RetrieveImage;

public class Handler(IOptions<SnapshotCaptureSettings> captureSettings)
{
    private static readonly Dictionary<string, string> MediaTypes = new()
    {
        { ".jpg", "jpeg" },
        { ".jpeg", "jpeg" },
        { ".png", "png" },
        { ".gif", "gif" },
        { ".bmp", "bmp" },
        { ".tiff", "tiff" },
        { ".ico", "x-icon" }
    };
    public Task<byte[]> Handle(RetrieveImage query)
    {
        return this.ReadFileAsync(query.FilePath);
    }
    
    public async Task<string> Handle(RetrieveImageAsBase64 query)
    {
        var buffer = await this.ReadFileAsync(query.CaptureId);
        var extension = Path.GetExtension(query.CaptureId);
        var mediaType = MediaTypes[extension];
        return $"data:image/{mediaType};base64,{Convert.ToBase64String(buffer)}";
    }
    
    private async Task<byte[]> ReadFileAsync(string filePath)
    {
        var path = Path.Combine(captureSettings.Value.FolderRoot, filePath);
        await using var file = File.OpenRead(path);
        var buffer = new byte[file.Length];
        var read = 0;
        do
        {
            read += await file.ReadAsync(buffer.AsMemory(read, buffer.Length - read));
        } while (read < buffer.Length);

        return buffer;
    }
}