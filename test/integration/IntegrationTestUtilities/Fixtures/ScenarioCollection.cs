namespace Cerberus.IntegrationTest.Utilities.Fixtures;

[Collection(ScenarioCollectionFixture)]
public class ScenarioCollection<T>: ICollectionFixture<AlbaHostFixture<T>> where T : class
{
    public  const string ScenarioCollectionFixture = "Scenarios";
}