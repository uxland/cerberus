namespace CerverusMaintenanceFeatures.Steps.MaintenanceChecks;

[Binding]
public class CreateConnectionFailureMaintenanceCheckStepDefinitions
{
    [Given(@"a capture snapshot from a camera")]
    public void GivenACaptureSnapshotFromACamera()
    {
        ScenarioContext.StepIsPending();
    }

    [When(@"the snapshot is received")]
    public void WhenTheSnapshotIsReceived()
    {
        ScenarioContext.StepIsPending();
    }

    [Then(@"a failed maintenance check should be created")]
    public void ThenAFailedMaintenanceCheckShouldBeCreated()
    {
        ScenarioContext.StepIsPending();
    }
}