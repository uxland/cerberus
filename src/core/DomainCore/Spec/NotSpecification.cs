using System.Linq.Expressions;

namespace Cerberus.Core.Domain.Spec;

public class NotSpecification<T>(Specification<T> spec) : Specification<T>
{
    public override bool IsSatisfiedBy(T item)
    {
        return !spec.IsSatisfiedBy(item);
    }

    public override Expression<Func<T, bool>> ToExpression()
    {
        var innerExpression = spec.ToExpression();
        var parameter = innerExpression.Parameters[0];
        var negated = Expression.Not(innerExpression.Body);
        return Expression.Lambda<Func<T, bool>>(negated, parameter);
    }
}