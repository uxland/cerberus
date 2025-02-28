using Cerberus.Surveillance.Features.Features.Run.Create;
using NodaTime;
using System;

namespace Cerberus.Surveillance.Features.Features.Run;

public partial class SurveillanceRun
{
    public SurveillanceRun(CreateRun cmd, string runId) : this()
    {
        this.ApplyUncommittedEvent(
            new SurveillanceRunCreated(
                runId,
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