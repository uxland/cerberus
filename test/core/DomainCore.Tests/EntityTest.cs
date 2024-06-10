using FluentAssertions;

namespace Cerberus.Core.Domain;

public class EntityTest
{
    [Fact]
    public void GivenNoIdIShouldBeTransient()
    {
        var entity = new TestEntity();
        entity.Transient.Should().BeTrue();

        entity = new TestEntity(string.Empty);
        entity.Transient.Should().BeTrue();
    }

    [Fact]
    public void GivenAnIdIShouldNotBeTransient()
    {
        var entity = new TestEntity(Guid.NewGuid().ToString());
        entity.Transient.Should().BeFalse();
    }

    public class EqualityTest
    {
        [Fact]
        public void GivenTwoEntitiesWithSameSettingsButDifferentIdsShouldNotBeEquals()
        {
            var entity1 = new TestEntity(Guid.NewGuid().ToString()) { MyProperty = "Test" };
            var entity2 = new TestEntity(Guid.NewGuid().ToString()) { MyProperty = "Test" };
            entity1.Should().NotBe(entity2);
        }

        [Fact]
        public void GivenTwoEntitiesWithSameIdShouldBeEquals()
        {
            var id = Guid.NewGuid().ToString();
            var entity1 = new TestEntity(id) { MyProperty = "Test1" };
            var entity2 = new TestEntity(id) { MyProperty = "Test2" };
            entity1.Should().Be(entity2);
        }

        [Fact]
        public void GivenTransientEntitiesShouldNotBeEquals()
        {
            var entity1 = new TestEntity();
            var entity2 = new TestEntity();
            entity1.Should().NotBe(entity2);
        }

        [Fact]
        public void GivenTwoDifferentEntityTypesWithSameIdShouldNotBeEquals()
        {
            var id = Guid.NewGuid().ToString();
            var entity1 = new TestEntity(id);
            var entity2 = new TestEntity2(id);
            entity1.Should().NotBe(entity2);
        }
    }

    private class TestEntity : Entity
    {
        public TestEntity()
        {
        }

        public TestEntity(string id) : base(id)
        {
        }

        public string? MyProperty { get; set; }
    }

    private class TestEntity2 : Entity
    {
        public TestEntity2()
        {
        }

        public TestEntity2(string id) : base(id)
        {
        }

        public string? MyProperty { get; set; }
    }
}