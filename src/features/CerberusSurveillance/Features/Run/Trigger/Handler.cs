using Cerberus.Core.Domain;
using Cerberus.Core.Domain.CronExpressions;
using Cerberus.Surveillance.Features.Features.Round.CreateOrUpdate;
using Cerberus.Surveillance.Features.Features.Run.Trigger.Create;
using Cerberus.Surveillance.Features.Features.Run.Trigger.EjectRounds;
using Cerberus.Surveillance.Features.Features.Run.Trigger.EnrollRounds;

namespace Cerberus.Surveillance.Features.Features.Run.Trigger;

public static class Handler
{
    public static RunCreationTriggerEnabled? Handle(
        SurveillanceRoundCreated @event,
        IGenericRepository repository
    )
    {
        return EnrollRound(@event.Settings.CronExpression, @event.Id, repository);
    }

    public static IEnumerable<object?> Handle(SurveillanceRoundExecutionRecurrencePatternChanged @event,
        IGenericRepository repository)
    {
        var (roundId, previousRecurrencePattern, newRecurrencePattern) = @event;
        yield return EjectRound(previousRecurrencePattern, roundId, repository);
        yield return EnrollRound(newRecurrencePattern, roundId, repository);
    }
    
    private static RunCreationTriggerEnabled? EnrollRound(string recurrencePattern, string roundId, IGenericRepository repository)
    {
        var trigger = repository.Rehydrate<RunCreationTrigger>(recurrencePattern).ConfigureAwait(true).GetAwaiter().GetResult();
        trigger = trigger == null ? Create(recurrencePattern, roundId, repository) : EnrollRound(trigger, roundId, repository);
        return trigger.GeFirstUncommittedEventOfType<RunCreationTriggerEnabled>();
    }

    private static RunCreationTrigger Create(string recurrencePattern, string roundId, IGenericRepository repository)
    {
        var trigger = new RunCreationTrigger(new CreateRunCreationTrigger(recurrencePattern.SanitizeForQuartz(), [roundId]));
        repository.Create(trigger);
        return trigger;
    }

    private static RunCreationTrigger EnrollRound(RunCreationTrigger trigger, string roundId,
        IGenericRepository repository)
    {
        trigger.Handle(new EnrollRoundsToTrigger(trigger.RecurrencePattern, [roundId]));
        repository.Save(trigger);
        return trigger;
    }

    private static RunCreationTriggerDisabled? EjectRound(string recurrencePattern, string roundId, IGenericRepository repository)
    {
        var trigger = repository.Rehydrate<RunCreationTrigger>(recurrencePattern).Result;
        if (trigger == null)
            return null;
        trigger.Handle(new EjectRoundsFromTrigger(trigger.Id, [roundId]));
        repository.Save(trigger);
        return trigger.GeFirstUncommittedEventOfType<RunCreationTriggerDisabled>();
    }
}