import {Container} from "inversify";
import {bootstrapListOpenIssues} from "./list-open-issues/bootstrapper.ts";
import {bootstrapShowMaintenanceIssue} from "./show-issue/bootstrapper.ts";

export const bootstrapIssues = (container: Container) => {
    return bootstrapListOpenIssues(container)
        .then(bootstrapShowMaintenanceIssue);
}