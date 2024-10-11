import {Container} from "inversify";
import {requestHandler} from "mediatr-ts";
import {AddCamera} from "./command";
import {AddCameraHandler} from "./handler";

export const bootstrapAddCamera = (container: Container) => {
  requestHandler(AddCamera)(AddCameraHandler);
  return Promise.resolve(container);
};
