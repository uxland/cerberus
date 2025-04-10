using NodaTime;

namespace Cerberus.Core.Domain.CronExpressions;

public static class Extensions
{
    public static string SanitizeForQuartz(this string cron)
    {
        var parts = cron.Trim().Split(' ', StringSplitOptions.RemoveEmptyEntries);

        if (parts.Length == 5)
            parts = new[] { "0" }.Concat(parts).ToArray();

        if (parts.Length != 6)
            throw new FormatException("Expected a 6-part Quartz cron expression");

        // Fix DOM/DOW ambiguity: if both are "*", set DOM to "?"
        if (parts[3] != "?" && parts[5] != "?")
            parts[3] = "?"; // default: prioritize day-of-week

        return string.Join(" ", parts);
    }
    public static Instant? ToInstant(this DateTimeOffset? dateTimeOffset, DateTimeZone timeZone)
    {
        if(dateTimeOffset == null)
            return null;
        var instant = Instant.FromDateTimeOffset(dateTimeOffset.Value);
        var zonedDateTime = instant.InZone(timeZone);
        var adjustedZonedDateTime = zonedDateTime.Date.At(new LocalTime(dateTimeOffset.Value.Hour, dateTimeOffset.Value.Minute, dateTimeOffset.Value.Second)).InZoneStrictly(timeZone);
        return adjustedZonedDateTime.ToInstant();
    }
}