using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using NodaTime;
using Wolverine;

namespace Cerberus.Surveillance.Features.Features.Run.Schedule;

internal static class Endpoint
{
    public static RouteGroupBuilder UseOperatorsSchedule(this RouteGroupBuilder app)
    {
        app.MapGet("/schedule", async (IMessageBus messageBus, IClock clock) =>
        {
            var query = new GetUserSchedule(UserId: "1", GroupId: "1", Day: clock.GetCurrentInstant(), Zone: DateTimeZoneProviders.Tzdb.GetSystemDefault());
            var scheduled = await messageBus.InvokeAsync<List<ScheduledRun>>(query);
            return Results.Ok(scheduled);
        });
        return app;
    }
}