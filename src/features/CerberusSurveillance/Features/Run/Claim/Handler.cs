using Cerberus.Core.Domain;
using Cerberus.Core.Domain.CronExpressions;
using Cerberus.Core.Domain.Errors;
using Cerberus.Surveillance.Features.Features.Round;
using Cerberus.Surveillance.Features.Features.Run.Create;
using NodaTime;
using Quartz;

namespace Cerberus.Surveillance.Features.Features.Run.Claim;

public static class Handler
{
    public static async Task<ClaimRunResult> Handle(ClaimRun command, IGenericRepository repository)
    {
        var (runId, at, by) = command;
        try
        {
            var created = false;
            var run = await repository.Rehydrate<SurveillanceRun>(runId);
            if (run is null)
            {
                run = await CreateRun(command, repository);
                created = true;
            }
            if(!run.IsStarted())
                run.Start(at, by);
            else
            {
                run.Handle(command);
            }
            if(created) repository.Create(run);
            else repository.Save(run);
            return new ClaimRunResult(true, run.Id);
        }
        catch (BusinessException e)
        {
            return new ClaimRunResult(
                false,
                null,
                e.Message
            );
        }
       
    }
    
    private static async Task<SurveillanceRun> CreateRun(ClaimRun command, IGenericRepository repository)
    {
        var (roundId, plannedAt) = command.RunId.GetRoundIdAndPlannedInstant();
        var round = await repository.RehydrateOrThrow<SurveillanceRound>(roundId);
        ValidateRunIsScheduled(roundId, plannedAt, round);
        var run = await round.ProduceRun(repository, plannedAt, true);
        return run;
    }

    private static void ValidateRunIsScheduled(string roundId, Instant plannedAt, SurveillanceRound round)
    {
        var expression = new CronExpression(round.ExecutionRecurrencePattern.SanitizeForQuartz()); 
        var plannedAtDateTime = plannedAt.InZone(DateTimeZone.Utc).ToDateTimeOffset();

        // Check if plannedAt matches the Cron expression
        if(expression.IsSatisfiedBy(plannedAtDateTime))
            throw new BusinessException("The run is not scheduled for the given time.");
    }
}