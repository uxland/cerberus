import {Container} from "inversify";
import {bootstrapShowOrganizationStructure} from "./show-organizational-structure/bootstrapper.ts";

export const bootstrapFeatures = (container: Container) =>{
    bootstrapShowOrganizationStructure(container);
}