namespace Cerberus.Surveillance.Features.Features.Shared.Specs;

public class OrSpec<T> : Spec<T>
{
    public OrSpec()
    {
    }

    public OrSpec(params Spec<T>[] specs)
    {
        Specs = new List<Spec<T>>(specs);
    }
    public List<Spec<T>> Specs { get; set; }
    public override bool IsSatisfiedBy(T item) => Specs.Any(it => it.IsSatisfiedBy(item));
}