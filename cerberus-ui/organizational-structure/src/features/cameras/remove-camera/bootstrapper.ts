import {Container} from "inversify";
import {DeleteCamera} from "./command";
import {DeleteCameraHandler} from "./handler";
import {registerCommandHandler} from "@cerberus/core";

export const bootstrapRemoveCamera = (container: Container) => {
  registerCommandHandler(DeleteCamera, DeleteCameraHandler);
  return Promise.resolve(container);
};