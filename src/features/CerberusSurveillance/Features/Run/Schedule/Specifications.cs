using System.Linq.Expressions;
using Cerberus.Core.Domain.Spec;
using NodaTime;

namespace Cerberus.Surveillance.Features.Features.Run.Schedule;

public static class SurveillanceRunSpecifications
{
    
    private class PlannedAfterSpec(Instant plannedAfter) : Specification<SurveillanceRun>
    {
        public override bool IsSatisfiedBy(SurveillanceRun item) => item.PlannedAt >= plannedAfter;

        public override Expression<Func<SurveillanceRun, bool>> ToExpression() => x => x.PlannedAt >= plannedAfter;
    }
    private class PlannedBeforeSpec(Instant plannedBefore) : Specification<SurveillanceRun>
    {
        public override bool IsSatisfiedBy(SurveillanceRun item) => item.PlannedAt <= plannedBefore;

        public override Expression<Func<SurveillanceRun, bool>> ToExpression() => x => x.PlannedAt <= plannedBefore;
    }


    public static Specification<SurveillanceRun> ByPlannedAt(Instant day, DateTimeZone zone)
    {
        var localDate = day.InZone(zone).Date;
        var startOfDay = localDate.AtStartOfDayInZone(zone).ToInstant();
        var endOfDay = localDate.PlusDays(1).AtStartOfDayInZone(zone).ToInstant();
        return (new PlannedAfterSpec(startOfDay) & new PlannedBeforeSpec(endOfDay))!;
    }
}