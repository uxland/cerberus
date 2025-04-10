using Cerberus.Core.Domain;
using Cerberus.Surveillance.Features.Features.Round;
using Cerberus.Surveillance.Features.Features.Round.List;
using Cerberus.Surveillance.Features.Features.Run.Create;

namespace Cerberus.Surveillance.Features.Features.Run.Publish;

public record SurveillanceRunCreatedNotification(
    string Id,
    string Description,
    string RoundId
);

public static class Handler
{
    public static async Task Handle(SurveillanceRunCreated created, IClientPublisher publisher, IReadModelQueryProvider queryProvider)
    {
        var round = await queryProvider.Rehydrate<SurveillanceRoundSummary>(created.RoundId);
        var description = round?.Description ?? "Unknown round";
        var notification = new SurveillanceRunCreatedNotification(
            created.Id,
            description,
            created.RoundId
        );
        await  publisher.PublishAsync(created.AssignedGroupId ?? "*","surveillance:run:created", notification);
    }
}