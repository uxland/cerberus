using System.Linq.Expressions;

namespace Cerberus.Core.Domain.Spec;

public abstract class Specification<T>
{
    public abstract bool IsSatisfiedBy(T item);

    public abstract Expression<Func<T, bool>> ToExpression();

    public static Specification<T>? operator &(Specification<T>? left, Specification<T>? right)
    {
        return left.And(right);
    }

    public static Specification<T>? operator |(Specification<T>? left, Specification<T>? right)
    {
        return left.Or(right);
    }

    public static Specification<T> operator !(Specification<T> spec)
    {
        return spec.Not();
    }
    
}

public static class SpecificationExtensions
{
    public static Specification<T>? And<T>(this Specification<T>? left, Specification<T>? right)
    {
        if(left is null && right is null) return null;
        if(left is null) return right;
        if(right is null) return left;
        return new AndSpecification<T>(left, right);
    }

    public static Specification<T>? Or<T>(this Specification<T>? left, Specification<T>? right)
    {
        if(left is null && right is null) return null;
        if(left is null) return right;
        if(right is null) return left;
        return new OrSpecification<T>(left, right);
    }

    public static Specification<T> Not<T>(this Specification<T> spec)
    {
        return new NotSpecification<T>(spec);
    }
}