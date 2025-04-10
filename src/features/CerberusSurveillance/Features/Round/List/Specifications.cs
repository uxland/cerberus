using System.Linq.Expressions;
using Cerberus.Core.Domain.Spec;
using LinqKit;

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
    
    private class AssignedToSpec(string[] groups): Specification<SurveillanceRoundSummary>
    {
        public override bool IsSatisfiedBy(SurveillanceRoundSummary item)
        {
            var assignedTo = item.AssignedTo ?? string.Empty;
            return groups.Any(assignedTo.StartsWith);
        }

        public override Expression<Func<SurveillanceRoundSummary, bool>> ToExpression()
        {
            
            var predicate = PredicateBuilder.New<SurveillanceRoundSummary>(false); // start with false

            foreach (var group in groups)
            {
                var localGroup = group; // prevent closure issues
                var localPredicate = 
                    PredicateBuilder.New<SurveillanceRoundSummary>(x => x.AssignedTo != null)
                        .And(x => x.AssignedTo!.StartsWith(localGroup));
                predicate = predicate.Or(localPredicate);
            }
            return predicate;
        }
    }
    public static Specification<SurveillanceRoundSummary>? ByRootLocation(string? rootLocationId) => 
        string.IsNullOrEmpty(rootLocationId) ? null : new RootLocationSpec(rootLocationId);
    
    public static Specification<SurveillanceRoundSummary> ByAssignedTo(string[] assignedTo) => 
        new AssignedToSpec(assignedTo);
}

