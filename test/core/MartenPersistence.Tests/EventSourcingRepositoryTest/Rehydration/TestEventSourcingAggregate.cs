using Cerverus.Core.Domain;

namespace Cerverus.Core.MartenPersistence.EventSourcingRepositoryTest.Rehydration;

public class TestEventSourcingAggregate: AggregateRoot
{
    public string Message1 { get; private set; }
    public string Message2 { get; private set; }
    public string Message3 { get; private set; }
    public void Apply(DomainEvent1 domainEvent1)
    {
        this.Message1 = domainEvent1.Message1;
    }
    public void Apply(DomainEvent2 domainEvent2)
    {
        this.Message2 = domainEvent2.Message2;
    }
    public void Apply(DomainEvent3 domainEvent3)
    {
        this.Message3 = domainEvent3.Message3;
    }
}