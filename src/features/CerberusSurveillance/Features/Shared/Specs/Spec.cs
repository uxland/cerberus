using System.Text.Json.Serialization;

namespace Cerberus.Surveillance.Features.Features.Shared.Specs;


public interface ISpec
{
    
}

/*[JsonPolymorphic(TypeDiscriminatorPropertyName = "__type")]
[JsonDerivedType(typeof(NotSpec<string>), "Not")]
[JsonDerivedType(typeof(AndSpec<string>), "And")]
[JsonDerivedType(typeof(OrSpec<string>), "Or")]
[JsonDerivedType(typeof(ValueEqualsSpec<string>), "Equals")]
[JsonDerivedType(typeof(ValueGraterThanSpec<string>), "GreaterThan")]
[JsonDerivedType(typeof(ValueLowerThanSpec<string>), "LowerThan")]*/
public abstract class Spec<T>: ISpec
{
    public abstract bool IsSatisfiedBy(T item);


    public static Spec<T>? operator &(Spec<T>? left, Spec<T>? right)
    {
        return left.And(right);
    }

    public static Spec<T>? operator |(Spec<T>? left, Spec<T>? right)
    {
        return left.Or(right);
    }

    public static Spec<T> operator !(Spec<T> spec)
    {
        return spec.Not();
    }
    
}