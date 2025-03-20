using System.Linq.Expressions;
using Cerberus.Core.Domain.Spec;

namespace Cerberus.Surveillance.Features.Features.Run.List;

public static class SurveillanceRunSummarySpecifications
{
    private class RootLocationSpec(string rootLocationId): Specification<SurveillanceRunSummary>
    {
        public override bool IsSatisfiedBy(SurveillanceRunSummary item) => 
            item.LocationId == rootLocationId;

        public override Expression<Func<SurveillanceRunSummary, bool>> ToExpression() => 
            x => x.LocationId == rootLocationId;
    }
    
    private class RoundSpec(string roundId): Specification<SurveillanceRunSummary>
    {
        public override bool IsSatisfiedBy(SurveillanceRunSummary item) => 
            item.RoundId == roundId;

        public override Expression<Func<SurveillanceRunSummary, bool>> ToExpression() => 
            x => x.RoundId == roundId;
    }
    public static Specification<SurveillanceRunSummary>? ByRootLocation(string? rootLocationId) => 
        string.IsNullOrEmpty(rootLocationId) ? null : new RootLocationSpec(rootLocationId);
    
    public static Specification<SurveillanceRunSummary>? ByRoundId(string? roundId) =>
        string.IsNullOrEmpty(roundId) ? null : new RoundSpec(roundId);
    
    public static Specification<SurveillanceRunSummary>? ByLocationAndRound(string? locationId, string? roundId) =>
        ByRootLocation(locationId).And(ByRoundId(roundId));
}