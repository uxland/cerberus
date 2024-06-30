import {Container} from "inversify";
import {addRoute, registerRouteComponent, store} from "@cerberus/core";
import {MaintenanceIssuePage} from "./component.tsx";
import {requestHandler} from "mediatr-ts";
import {Handler, Query} from "./query.ts";
import {bootstrapCloseIssue} from "./close-issue/bootstrapper.ts";
import {bootstrapStartIssue} from "./start-issue/bootstrapper.ts";

export const bootstrapShowMaintenanceIssue = (container: Container) => {
    registerRouteComponent(MaintenanceIssuePage.name, MaintenanceIssuePage);
    store.dispatch(addRoute({path: 'maintenance/issues/:id', componentName: MaintenanceIssuePage.name, name: 'Issue'}));
    requestHandler(Query)(Handler);
    return bootstrapCloseIssue(container)
        .then(bootstrapStartIssue);
}