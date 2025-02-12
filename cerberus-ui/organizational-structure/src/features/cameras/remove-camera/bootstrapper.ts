import {Container} from "inversify";
import {DeleteCamera} from "./command";
import {DeleteCameraHandler} from "./handler";
// import {registerCommandHandler} from "@cerberus/core";
import {requestHandler} from "mediatr-ts";

export const bootstrapRemoveCamera = (container: Container) => {
  requestHandler(DeleteCamera)(DeleteCameraHandler);
  return Promise.resolve(container);
};