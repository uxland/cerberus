import {Container} from "inversify";
import {bootstrapShowOrganizationStructure} from "./show-organizational-structure/bootstrapper.ts";
import {bootstrapUploadOrganizationStructureFile} from "./upload-organization-structure-file/bootstrapper.ts";
import {bootstrapLocations} from "./locations/bootstrapper.ts";

export const bootstrapFeatures = (container: Container): Promise<Container> =>{
    return bootstrapShowOrganizationStructure(container)
        .then(bootstrapUploadOrganizationStructureFile)
        .then(bootstrapLocations);
}