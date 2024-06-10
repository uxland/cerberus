using TechTalk.SpecFlow;

namespace Cerberus.Features.StepDefinitions.Core;

public abstract class StepDefinitionBase<TFixture>(ScenarioContext scenarioContext)
    where TFixture : class
{
    protected readonly ScenarioContext ScenarioContext = scenarioContext;

    protected TFixture Fixture
    {
        get => this.ScenarioContext.TryGetValue(nameof(Fixture), out var fixture) ? (TFixture)fixture : null!;
        set => this.ScenarioContext.Add(nameof(Fixture), value);
    }
}