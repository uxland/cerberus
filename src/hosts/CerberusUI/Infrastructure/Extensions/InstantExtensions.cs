using System.Globalization;
using NodaTime;

namespace Cerberus.UI.Infrastructure.Extensions;

public static class InstantExtensions
{
    public static string Format(this Instant instant, string? format = null)
    {
        var timeZone = DateTimeZoneProviders.Tzdb.GetSystemDefault();
        var localDateTime = instant.InZone(timeZone).LocalDateTime;
        return localDateTime.ToString(format ?? "G", CultureInfo.InvariantCulture);
    }
}