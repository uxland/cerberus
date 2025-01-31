import {Container} from "inversify";
import {requestHandler} from "mediatr-ts";
import {DeleteCamera} from "./command";
import {DeleteCameraHandler} from "./handler";

export const bootstrapRemoveCamera = (container: Container) => {
  requestHandler(DeleteCamera)(DeleteCameraHandler);
  return Promise.resolve(container);
};