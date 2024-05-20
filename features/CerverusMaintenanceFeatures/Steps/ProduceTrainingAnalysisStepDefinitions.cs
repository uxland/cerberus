namespace CerverusMaintenanceFeatures.Steps;

[Binding]
public class ProduceTrainingAnalysisStepDefinitions
{
    [Given(@"a camera in training mode")]
    public void GivenACameraInTrainingMode()
    {
        ScenarioContext.StepIsPending();
    }
    
    [When(@"a capture is made for the camera")]
    public void WhenACaptureIsMadeForTheCamera()
    {
        ScenarioContext.StepIsPending();
    }
    
    [Then(@"the training analysis should be produced")]
    public void ThenTheTrainingAnalysisShouldBeProduced()
    {
        
        ScenarioContext.StepIsPending();
    }


    
}