﻿using Cerberus.Core.Domain;

namespace Cerberus.Core.MartenPersistence.EventSourcingRepositoryTest.Rehydration;

public class TestEventSourcingAggregate : AggregateRoot
{
    public string Message1 { get; private set; }
    public string Message2 { get; private set; }
    public string Message3 { get; private set; }

    public void Apply(DomainEvent1 domainEvent1)
    {
        Message1 = domainEvent1.Message1;
    }

    public void Apply(DomainEvent2 domainEvent2)
    {
        Message2 = domainEvent2.Message2;
    }

    public void Apply(DomainEvent3 domainEvent3)
    {
        Message3 = domainEvent3.Message3;
    }
}