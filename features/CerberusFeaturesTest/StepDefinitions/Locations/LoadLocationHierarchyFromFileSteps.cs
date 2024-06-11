using Cerberus.Features.Fixtures;
using Cerberus.Features.StepDefinitions.Core;
using TechTalk.SpecFlow;

namespace Cerberus.Features.StepDefinitions.Locations;

[Binding]
public class LoadLocationHierarchyFromFileSteps(ScenarioContext scenarioContext) : BackOfficeStepDefinitionsBase<BackOfficeFixture>(scenarioContext)
{

    [Given(@"I have a file with the following location hierarchy")]
    public void GivenIHaveAFileWithTheFollowingLocationHierarchy(Table table)
    {
        ScenarioContext.StepIsPending();
    }

    [When(@"I push the file to the system")]
    public void WhenIPushTheFileToTheSystem()
    {
        ScenarioContext.StepIsPending();
    }

    [Then(@"the system should create the location hierarchy")]
    public void ThenTheSystemShouldCreateTheLocationHierarchy()
    {
        ScenarioContext.StepIsPending();
    }
}