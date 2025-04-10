using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run.Schedule;

public record GetUserSchedule(string UserId, string GroupId, Instant Day, DateTimeZone Zone);