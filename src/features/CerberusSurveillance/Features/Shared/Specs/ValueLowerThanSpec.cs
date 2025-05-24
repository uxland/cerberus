namespace Cerberus.Surveillance.Features.Features.Shared.Specs;

public class ValueLowerThanSpec<T> : Spec<T>
{
    public ValueLowerThanSpec(){}
    public ValueLowerThanSpec(T value)
    {
        Value = value;
    }
    public T Value { get; set; }
    public override bool IsSatisfiedBy(T item)
    {
        if(item is IComparable<T> comparable)
            return comparable.CompareTo(Value) < 0;
        throw new InvalidCastException($"Item of type {typeof(T)} does not implement IComparable<T>.");
    }
}