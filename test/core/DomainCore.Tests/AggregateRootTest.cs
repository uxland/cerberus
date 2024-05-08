using System.Collections.ObjectModel;
using FluentAssertions;

namespace Cerverus.Core.Domain;

public class AggregateRootTest
{
    public class ApplyEventTest
    {
        [Fact]
        public void ItShouldInvokeTheApplyMethod()
        {
            // Arrange
            var aggregateRoot = new TestAggregateRoot();
            var @event = new DomainEvent1("Hello World!");

            // Act
            aggregateRoot.ApplyEvent(@event);

            // Assert
            aggregateRoot.ApplyDomainEvent1Count.Should().Be(1);
        }

        [Fact]
        public void ItShouldNotAddEventToUncommittedEvents()
        {
            // Arrange
            var aggregateRoot = new TestAggregateRoot();
            var @event = new DomainEvent1("Hello World!");

            // Act
            aggregateRoot.ApplyEvent(@event);

            // Assert
            aggregateRoot.GetUncommittedEvents().Should().BeEmpty();
        }

        [Fact]
        public void ItShouldIncreaseVersionNumber()
        {
            // Arrange
            var aggregateRoot = new TestAggregateRoot();
            var @event = new DomainEvent1("Hello World!");

            // Act
            aggregateRoot.ApplyEvent(@event);

            // Assert
            aggregateRoot.Version.Should().Be(1);
        }

        [Fact]
        public void ShouldFailIfNoApplyMethod()
        {
            // Arrange
            var aggregateRoot = new TestAggregateRoot();
            var @event = new DomainEvent2("Hello World!");

            // Act
            var exception = Assert.Throws<MissingMethodException>(() => aggregateRoot.ApplyEvent(@event));

            // Assert
            exception.Message.Should().Be("Method Apply(DomainEvent2) not found in TestAggregateRoot");
        }
    }

    public class ApplyUncommittedEventTest
    {
        [Fact]
        public void ItShouldAddEventToUncommittedEvents()
        {
            // Arrange
            var aggregateRoot = new TestAggregateRoot();
            var @event = new DomainEvent1("Hello World!");

            // Act
            aggregateRoot.ApplyUncommittedEvent(@event);

            // Assert
            aggregateRoot.GetUncommittedEvents().Should().Contain(@event);
        }

        [Fact]
        public void GetUncommittedEventsShouldReturnReadOnlyList()
        {
            // Arrange
            var aggregateRoot = new TestAggregateRoot();
            var @event = new DomainEvent1("Hello World!");

            // Act
            aggregateRoot.ApplyUncommittedEvent(@event);

            // Assert
            aggregateRoot.GetUncommittedEvents().Should().BeOfType<ReadOnlyCollection<IDomainEvent>>();
        }

        [Fact]
        public void ItShouldIncreaseVersionAndInvokeApplier()
        {
            // Arrange
            var aggregateRoot = new TestAggregateRoot();
            var @event = new DomainEvent1("Hello World!");

            // Act
            aggregateRoot.ApplyUncommittedEvent(@event);

            // Assert
            aggregateRoot.Version.Should().Be(1);
            aggregateRoot.ApplyDomainEvent1Count.Should().Be(1);
        }
    }

    private class TestAggregateRoot : AggregateRoot
    {
        public TestAggregateRoot()
        {
        }

        public TestAggregateRoot(String id) : base(id)
        {
        }

        public int ApplyDomainEvent1Count { get; private set; }

        private void Apply(DomainEvent1 @event)
        {
            ApplyDomainEvent1Count++;
        }
    }

    private record DomainEvent1(string Value = "") : IDomainEvent;

    private record DomainEvent2(string Value = "") : IDomainEvent;

    private record DomainEvent3(string Value = "") : IDomainEvent;
}