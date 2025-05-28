namespace Cerberus.Surveillance.Features.Features.Shared.Specs;

public class AndSpec<T> : Spec<T>
{
    public AndSpec(){}
    public AndSpec(params Spec<T>[] specs)
    {
        Specs = new List<Spec<T>>(specs);
    }
    public List<Spec<T>> Specs { get; set; } 
    public override bool IsSatisfiedBy(T item) => Specs.All(it => it.IsSatisfiedBy(item));
}