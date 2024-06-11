using System.Linq.Expressions;

namespace Cerberus.Core.Domain.Spec;

public abstract class Specification<T>
{
    public abstract bool IsSatisfiedBy(T item);
    
    public abstract Expression<Func<T, bool>> ToExpression();
    
    public static Specification<T> operator &(Specification<T> left, Specification<T> right) =>
        new AndSpecification<T>(left, right);
    public static Specification<T> operator |(Specification<T> left, Specification<T> right) =>
        new OrSpecification<T>(left, right);

    public static Specification<T> operator !(Specification<T> spec) => new NotSpecification<T>(spec);
    
    public Specification<T> And(Specification<T> other) => new AndSpecification<T>(this, other);
    public Specification<T> Or(Specification<T> other) => new OrSpecification<T>(this, other);
    public Specification<T> Not() => new NotSpecification<T>(this);
}
