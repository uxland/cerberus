import {Container} from "inversify";
import {bootstrapAddCamera} from "./add-camera/bootstrapper";
import {bootstrapRemoveCamera} from "./remove-camera/bootstrapper";

export const bootstrapCameras = (container: Container): Promise<Container> => {
  return bootstrapAddCamera(container)
    .then(() => bootstrapRemoveCamera(container));
};
