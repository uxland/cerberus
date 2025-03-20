import { addRoute, registerRouteComponent, store } from "@cerberus/core";
import { RunSummaryView } from "./component.tsx";
import { Container } from "inversify";
import { ListRuns } from "./query.ts";
import { ListRunsHandler } from "./handler.ts";
import { registerCommandHandler } from "@cerberus/core";


export const useListRuns = (container: Container) => {
    registerRouteComponent(RunSummaryView.name, RunSummaryView);
    store.dispatch(
        addRoute({
            path: "surveillance/locations/:locationId/rounds/:roundId/runs",
            componentName: RunSummaryView.name,
            name: "run-summary"
        })
    );
    registerCommandHandler(ListRuns, ListRunsHandler);
    return Promise.resolve(container);
}