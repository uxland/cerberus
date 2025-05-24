namespace Cerberus.Surveillance.Features.Features.Shared.Specs;

public class ValueGraterThanSpec<T> : Spec<T>
{
    public ValueGraterThanSpec(){}
    public ValueGraterThanSpec(T value)
    {
        Value = value;
    }
    public T Value { get; set; }
    public override bool IsSatisfiedBy(T item)
    {
        if(item is IComparable<T> comparable)
            return comparable.CompareTo(Value) > 0;
        throw new InvalidCastException($"Item of type {typeof(T)} does not implement IComparable<T>.");
    }
}