
import { Container } from "inversify";
import { useListRunsByLocation } from "./byLocation";
import { useListRunsByRound } from "./byRound";
import { addRoute, registerRouteComponent, store } from "@cerberus/core";
import { RunSummaryView } from "./component";
import { ListRuns } from "./query";
import { ListRunsHandler } from "./handler";
import { registerCommandHandler } from "@cerberus/core";

export const useRunList = (container: Container) => {
    registerRouteComponent(RunSummaryView.name, RunSummaryView);
    store.dispatch(
        addRoute({
            path: "surveillance/runs",
            componentName: RunSummaryView.name,
            name: "run-summary"
        })
    );
    registerCommandHandler(ListRuns, ListRunsHandler);

    return useListRunsByLocation(container)
        .then(useListRunsByRound)
}