using JasperFx.Events.Daemon;
using JasperFx.Events.Projections;
using Marten;
using Marten.Subscriptions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Wolverine;

namespace Cerberus.BackOffice.Persistence.Subscriptions;

public class CameraSettingsSubscription(IServiceProvider serviceProvider, ILogger<CameraRecurrencePatternSubscription> logger): SubscriptionBase
{
    public override async Task<IChangeListener> ProcessEventsAsync(EventRange page, ISubscriptionController controller, IDocumentOperations operations,
        CancellationToken cancellationToken)
    {
        foreach (var @event in page.Events.OrderBy(x => x.Sequence))
        {
            logger.LogInformation("Processing camera settings event {EventId} for {StreamId}", @event.Id, @event.StreamId);
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<IMessageContext>();
            await context.InvokeAsync(@event.Data, cancellationToken);
        }

        return NullChangeListener.Instance;
    }
}