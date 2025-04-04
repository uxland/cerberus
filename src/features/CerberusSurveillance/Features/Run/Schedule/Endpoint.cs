using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using NodaTime;
using NodaTime.Extensions;
using Wolverine;

namespace Cerberus.Surveillance.Features.Features.Run.Schedule;

internal static class Endpoint
{
    public static RouteGroupBuilder UseOperatorsSchedule(this RouteGroupBuilder app)
    {
        app.MapGet("/schedule", async (IMessageBus messageBus, IClock clock) =>
        {
            var timeZone = DateTimeZoneProviders.Tzdb.GetZoneOrNull("Europe/Madrid");
            var zonedClock = clock.InZone(timeZone);
            var today = zonedClock.GetCurrentInstant();
            var query = new GetUserSchedule(UserId: "1", GroupId: "1", Day: today, Zone: timeZone);
            var scheduled = await messageBus.InvokeAsync<List<ScheduledRun>>(query);
            return Results.Ok(scheduled);
        });
        return app;
    }
}