using Cerberus.Core.Domain;

namespace Cerberus.Core.MartenPersistence.EventSourcingRepositoryTest.Rehydration;

public class TestRehydration
{
    private static Task SetupAggregateRoot(MartenDbFixture fixture, string aggregateRootString,
        params object[] domainEvents)
    {
        fixture.DocumentSession.Events.StartStream(aggregateRootString, domainEvents);
        return fixture.DocumentSession.SaveChangesAsync();
    }

    private static IRepository<TestEventSourcingAggregate> CreateSute(MartenDbFixture fixture)
    {
        return new TestEventSourcingAggregateRepository(fixture.DocumentSession);
    }


    [Theory]
    [MartenDbAutoData]
    public async Task ShouldRehydrateAggregateRoot(
        MartenDbFixture fixture,
        string id,
        DomainEvent1 domainEvent1,
        DomainEvent2 domainEvent2,
        DomainEvent3 domainEvent3)
    {
        await SetupAggregateRoot(fixture, id, domainEvent1, domainEvent2, domainEvent3);
        var sut = CreateSute(fixture);
        var actual = await sut.Rehydrate(id);
        actual!.Version.Should().Be(3);
        actual.Message1.Should().Be(domainEvent1.Message1);
        actual.Message2.Should().Be(domainEvent2.Message2);
        actual.Message3.Should().Be(domainEvent3.Message3);
    }
}