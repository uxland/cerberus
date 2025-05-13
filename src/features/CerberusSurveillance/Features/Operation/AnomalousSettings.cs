namespace Cerberus.Surveillance.Features.Features.Operation;

public class AnomalousSettings(List<OperationAction> actions)
{
    public List<OperationAction> Actions { get; } = actions;
}

public class AnomalousSettings<T>(T value, List<OperationAction> actions): AnomalousSettings(actions)
    where T : struct, IComparable<T>
{
    public T Value { get; } = value;
    
}