using System.Linq.Expressions;

namespace Cerberus.Core.Domain.Spec;

public class AndSpecification<T>(Specification<T> left, Specification<T> right) : Specification<T>
{
    public override bool IsSatisfiedBy(T item)
    {
        return left.IsSatisfiedBy(item) && right.IsSatisfiedBy(item);
    }

    public override Expression<Func<T, bool>> ToExpression()
    {
        var leftExpression = left.ToExpression();
        var rightExpression = right.ToExpression();
        var parameter = leftExpression.Parameters[0];
        var body = Expression.AndAlso(leftExpression.Body, rightExpression.Body);
        return Expression.Lambda<Func<T, bool>>(body, parameter);
    }
}