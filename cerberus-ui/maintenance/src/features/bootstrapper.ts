import { Container } from "inversify";
import { bootstrapIssues } from "./issues/bootstrapper.ts";
import { bootstrapTraining } from "./training/bootstrapper.ts";
import { bootstrapFilters } from "./filters/bootstrapper.ts";

export const bootstrapMaintenance = (container: Container) => {
    return bootstrapIssues(container)
        .then(bootstrapTraining)
        .then(bootstrapFilters);
}