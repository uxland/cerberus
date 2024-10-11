import {Container} from "inversify";
import {bootstrapCameras} from "./cameras/bootstrapper.ts";
import {bootstrapCaptureSnapshot} from "./capture-snapshot/bootstrapper.ts";
import {bootstrapLocations} from "./locations/bootstrapper.ts";
import {bootstrapShowOrganizationStructure} from "./show-organizational-structure/bootstrapper.ts";
import {bootstrapOrganizationStructureState} from "./state/bootstrapper.ts";
import {bootstrapUploadOrganizationStructureFile} from "./upload-organization-structure-file/bootstrapper.ts";

export const bootstrapFeatures = (container: Container): Promise<Container> => {
  return bootstrapShowOrganizationStructure(container)
    .then(bootstrapUploadOrganizationStructureFile)
    .then(bootstrapLocations)
    .then(bootstrapCameras)
    .then(bootstrapCaptureSnapshot)
    .then(bootstrapOrganizationStructureState);
};
