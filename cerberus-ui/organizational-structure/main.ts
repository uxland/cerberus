
import {Container} from "inversify";
import {bootstrapFeatures} from "./src/features/bootstrapper";

export const main = () => {
    console.log("main organizational-structure");
}

export const bootstrapOrganizationalStructure = (container: Container) => {
    console.log('organizational-structure bootstrapping');
    return  bootstrapFeatures(container)
}