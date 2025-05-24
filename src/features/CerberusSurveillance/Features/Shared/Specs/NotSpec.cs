namespace Cerberus.Surveillance.Features.Features.Shared.Specs;

public class NotSpec<T> : Spec<T>
{
    public NotSpec(){}
    public NotSpec(Spec<T> spec)
    {
        Spec = spec;
    }
    public Spec<T> Spec { get; set; }
    public override bool IsSatisfiedBy(T item) => !Spec.IsSatisfiedBy(item);
}