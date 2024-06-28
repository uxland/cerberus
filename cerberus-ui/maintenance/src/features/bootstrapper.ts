import {Container} from "inversify";
import {bootstrapIssues} from "./issues/bootstrapper.ts";
import {bootstrapTraining} from "./training/bootstrapper.ts";

export const boostrapMaintenance = (container: Container) => {
    return bootstrapIssues(container)
        .then(bootstrapTraining);
}