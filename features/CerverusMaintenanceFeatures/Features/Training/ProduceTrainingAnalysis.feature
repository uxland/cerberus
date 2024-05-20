Feature: Produce Training Analysis
In order to adjust the system performance
As maintenance technician
I want to produce a training analysis for a camera

    @maintenance 
    @training
    Scenario: Regula flow
        Given  a camera in training mode
        When a capture is made for the camera
        Then the training analysis should be produced