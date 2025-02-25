using System.Linq.Expressions;
using Cerberus.Core.Domain.Spec;

namespace Cerberus.Surveillance.Features.Features.Round.List;

public static class SurveillanceRoundSummarySpecifications
{
    private class RootLocationSpec(string rootLocationId): Specification<SurveillanceRoundSummary>
    {
        public override bool IsSatisfiedBy(SurveillanceRoundSummary item) => 
            item.RootLocationId == rootLocationId;

        public override Expression<Func<SurveillanceRoundSummary, bool>> ToExpression() => 
            x => x.RootLocationId == rootLocationId;
    }
    public static Specification<SurveillanceRoundSummary>? ByRootLocation(string? rootLocationId) => 
        string.IsNullOrEmpty(rootLocationId) ? null : new RootLocationSpec(rootLocationId);
}

