namespace Cerberus.Surveillance.Features.Features.Operation;

public record NormalityRange<T> (AnomalousSettings<T>? LowerBound, AnomalousSettings<T>? UpperBound) where T : struct, IComparable<T>
{
    
    public bool IsWithinRange(T value)
    {
        return (LowerBound == null || value.CompareTo(LowerBound.Value) >= 0) && (UpperBound == null || value.CompareTo(UpperBound.Value) <= 0);
    }
    
    public bool IsOutOfRange(T value)
    {
        return !IsWithinRange(value);
    }
}