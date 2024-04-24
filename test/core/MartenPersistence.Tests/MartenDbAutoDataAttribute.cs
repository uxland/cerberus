using AutoFixture;
using AutoFixture.Xunit2;
using Cerverus.IntegrationTest.Utilities.TestContainer.Containers;

namespace Cerverus.Core.MartenPersistence;

public class MartenDbAutoDataAttribute()
    : AutoDataAttribute(() => new Fixture().Customize(new PostgresContainerFixture()))
{
    private class PostgresContainerFixture: ICustomization
    {
        public void Customize(IFixture fixture)
        {
            var connectionString = fixture.StartPostgresQlContainer().Result;
            fixture.Inject(new MartenDbFixture(connectionString));
        }
    }
}