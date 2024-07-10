import {Container} from "inversify";
import {bootstrapShowOrganizationStructure} from "./show-organizational-structure/bootstrapper.ts";
import {bootstrapUploadOrganizationStructureFile} from "./upload-organization-structure-file/bootstrapper.ts";
import {bootstrapLocations} from "./locations/bootstrapper.ts";
import {bootstrapCaptureSnapshot} from "./capture-snapshot/bootstrapper.ts";
import {bootstrapOrganizationStructureState} from "./state/bootstrapper.ts";

export const bootstrapFeatures = (container: Container): Promise<Container> =>{
    return bootstrapShowOrganizationStructure(container)
        .then(bootstrapUploadOrganizationStructureFile)
        .then(bootstrapLocations)
        .then(bootstrapCaptureSnapshot)
        .then(bootstrapOrganizationStructureState);
}