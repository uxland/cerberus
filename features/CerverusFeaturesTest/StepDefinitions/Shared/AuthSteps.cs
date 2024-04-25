using Cerverus.Features.Fixtures;
using Cerverus.Features.StepDefinitions.Core;
using TechTalk.SpecFlow;

namespace Cerverus.Features.StepDefinitions.Shared;

[Binding]
public class AuthSteps(ScenarioContext scenarioContext) : BackOfficeStepDefinitionsBase<BackOfficeFixture>(scenarioContext)
{
    [Given(@"I'm an logged in as an admin")]
    public void GivenImAnLoggedInAsAnAdmin()
    {
        //Todo: Implement this step
    }
    
}