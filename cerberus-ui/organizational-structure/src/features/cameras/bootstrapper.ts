import {Container} from "inversify";
import {bootstrapAddCamera} from "./add-camera/bootstrapper";

export const bootstrapCameras = (container: Container): Promise<Container> => {
  return bootstrapAddCamera(container);
};
