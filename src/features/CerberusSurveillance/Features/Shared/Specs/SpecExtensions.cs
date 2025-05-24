namespace Cerberus.Surveillance.Features.Features.Shared.Specs;

public static class SpecExtensions
{
    public static Spec<T>? And<T>(this Spec<T>? left, Spec<T>? right)
    {
        if(left is null && right is null) return null;
        if(left is null) return right;
        if(right is null) return left;
        return new AndSpec<T>(left, right);
    }

    public static Spec<T>? Or<T>(this Spec<T>? left, Spec<T>? right)
    {
        if(left is null && right is null) return null;
        if(left is null) return right;
        if(right is null) return left;
        return new OrSpec<T>(left, right);
    }

    public static Spec<T> Not<T>(this Spec<T> spec)
    {
        return new NotSpec<T>(spec);
    }
}