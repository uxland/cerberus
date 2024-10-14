import {
  addRoute,
  registerCommandHandlers,
  registerRouteComponent,
  store,
} from "@cerberus/core";
import {Container} from "inversify";
import {
  CalibrateCameraFilter,
  GetCameraFilterArgs,
  SetCameraFilterArgs,
} from "./command.ts";
import {CalibrateCameraFilterPage} from "./component.tsx";
import {
  CalibrateCameraFilterHandler,
  GetCameraFilterArgsHandler,
  SetCameraFilterArgsHandler,
} from "./handler.ts";

const commands = [
  {command: CalibrateCameraFilter, handler: CalibrateCameraFilterHandler},
  {command: SetCameraFilterArgs, handler: SetCameraFilterArgsHandler},
  {command: GetCameraFilterArgs, handler: GetCameraFilterArgsHandler},
];

export const bootstrapCalibrateCameraFilter = (container: Container) => {
  registerRouteComponent(
    CalibrateCameraFilterPage.name,
    CalibrateCameraFilterPage
  );
  store.dispatch(
    addRoute({
      path: "maintenance/camera-settings/:cameraId/calibrate-filter/:filterId",
      componentName: CalibrateCameraFilterPage.name,
      name: "calibrate-filter",
    })
  );
  registerCommandHandlers(commands);
  return Promise.resolve(container);
};
