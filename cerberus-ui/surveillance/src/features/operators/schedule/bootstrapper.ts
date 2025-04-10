import { addRoute, registerRouteComponent, registerCommandHandler, store } from "@cerberus/core";
import { Container } from "inversify";
import { ScheduledRunsView } from "./component";
import { ListScheduledRuns } from "./query";
import { ListShceduledRunsHandler } from "./handler";

export const useScheduler = (container: Container) => {
    registerCommandHandler(ListScheduledRuns, ListShceduledRunsHandler);
    registerRouteComponent(ScheduledRunsView.name, ScheduledRunsView);
    store.dispatch(
        addRoute({
            path: "surveillance/scheduler",
            componentName: ScheduledRunsView.name,
            name: "operator-scheduler",
        })
    );
    return Promise.resolve(container);
}