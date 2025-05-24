namespace Cerberus.Surveillance.Features.Features.Shared.Specs;

public class ValueEqualsSpec<T> : Spec<T>
{
    public ValueEqualsSpec(){}
    public ValueEqualsSpec(T value)
    {
        Value = value;
    }
    public T Value { get; set; }
    public override bool IsSatisfiedBy(T item) => EqualityComparer<T>.Default.Equals(item, Value);
}