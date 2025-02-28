using Cerberus.Surveillance.Features.Features.Run.Create;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run;

public partial class SurveillanceRun
{
    public SurveillanceRun(CreateRun cmd)
    {
        this.ApplyUncommittedEvent(
            new SurveillanceRunCreated(
                cmd.Id!,
                cmd.RoundId
            )
        );
    }

    public void Apply(SurveillanceRunCreated @event)
    {
        this.Id = @event.Id;
        this.RoundId = @event.RoundId;
    }
}