import {Container} from "inversify";
import {addRoute, registerCommandHandlers, registerRouteComponent, store} from "@cerberus/core";
import {CalibrateCameraFilter, GetCameraFilterArgs, SetCameraFilterArgs} from "./command.ts";
import {CalibrateCameraFilterHandler, GetCameraFilterArgsHandler, SetCameraFilterArgsHandler} from "./handler.ts";
import {CalibrateCameraFilterPage} from "./component.tsx";

const commands = [
    {command: CalibrateCameraFilter, handler: CalibrateCameraFilterHandler},
    {command: SetCameraFilterArgs, handler: SetCameraFilterArgsHandler},
    {command: GetCameraFilterArgs, handler: GetCameraFilterArgsHandler}
];

export const bootstrapCalibrateCameraFilter = (container: Container) => {
    registerRouteComponent(CalibrateCameraFilterPage.name, CalibrateCameraFilterPage);
    store.dispatch(addRoute({path: 'maintenance/camera-settings/:cameraId/calibrate-filter/:filterId', componentName: CalibrateCameraFilterPage.name, name: 'Issue'}));
    registerCommandHandlers(commands);
    return Promise.resolve(container);
}