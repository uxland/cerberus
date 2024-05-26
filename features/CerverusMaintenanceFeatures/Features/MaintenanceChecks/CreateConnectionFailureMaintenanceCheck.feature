Feature: CreateConnectionFailureMaintenanceCheck
	In order to early detect not responding cameras
	As a maintenance engineer
	I want that whenever there's an erronnous capture from a camera, a failed maintenance check is created

@maintenance-check
Scenario: Regular flow
	Given a capture snapshot from a camera
	When the snapshot is received
	Then a failed maintenance check should be created