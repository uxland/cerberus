
import {Container} from "inversify";
import {bootstrapFeatures} from "./src/features/bootstrapper";

export const main = () => {
    console.log("main organizational-structure");
}

export const bootstrapOrganizationalStructure = async (container: Container) => {
    console.log('organizational-structure bootstrapping');
    bootstrapFeatures(container)
    return container;
}