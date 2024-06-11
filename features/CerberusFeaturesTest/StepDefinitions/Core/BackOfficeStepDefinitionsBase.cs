using Cerberus.IntegrationTest.Utilities.Fixtures;
using TechTalk.SpecFlow;
using Xunit.Abstractions;

namespace Cerberus.Features.StepDefinitions.Core;

public abstract class BackOfficeStepDefinitionsBase<TFixture>(ScenarioContext scenarioContext)
    : StepDefinitionBase<TFixture>(scenarioContext) where TFixture : class, IHostFixture, new()
{
    [BeforeScenario]
    public Task InitializeFixture()
    {
        if(ScenarioContext.ContainsKey(nameof(Fixture)))
            return Task.CompletedTask;
        var testOutputHelper = this.ScenarioContext.ScenarioContainer.Resolve<ITestOutputHelper>();
        var fixture = new TFixture();
        fixture.SetTestOutput(testOutputHelper);
        this.Fixture = fixture;
        return fixture.InitializeAsync();
    }
    [AfterScenario]
    public Task DisposeAsync()
    {
        return this.Fixture.DisposeAsync();
    }
}