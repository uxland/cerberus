using Cerberus.Maintenance.Features.Features.Shared;

namespace Cerberus.UI.Infrastructure.Extensions;

public static class CaptureInfoExtensions
{
    public static string GetImageUri(this CaptureInfo? captureInfo)
    {
        return captureInfo?.SnapshotUri.GetImageUrl() ?? string.Empty;
    }
}

public static class ImageUrlExtensions
{
    public static string GetImageUrl(this string? imageUri)
    {
        return string.IsNullOrEmpty(imageUri) ? string.Empty : $"/images/{imageUri}";
    }
}