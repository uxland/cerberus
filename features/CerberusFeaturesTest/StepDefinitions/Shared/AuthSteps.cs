using Cerberus.Features.Fixtures;
using Cerberus.Features.StepDefinitions.Core;
using TechTalk.SpecFlow;

namespace Cerberus.Features.StepDefinitions.Shared;

[Binding]
public class AuthSteps(ScenarioContext scenarioContext) : BackOfficeStepDefinitionsBase<BackOfficeFixture>(scenarioContext)
{
    [Given(@"I'm an logged in as an admin")]
    public void GivenImAnLoggedInAsAnAdmin()
    {
        //Todo: Implement this step
    }
    
}