import { addRoute, registerRouteComponent, store } from "@cerberus/core";
import { RoundRunsView } from "./component.tsx";
import { Container } from "inversify";
import { ListRunsByRound } from "./query.ts";
import { ListRunsByRoundHandler } from "./handler.ts";
import { registerCommandHandler } from "@cerberus/core";


export const useListRunsByRound = (container: Container) => {
    registerRouteComponent(RoundRunsView.name, RoundRunsView);
    store.dispatch(
        addRoute({
            path: "surveillance/locations/:locationId/rounds/:roundId/runs",
            componentName: RoundRunsView.name,
            name: "round-run-summary"
        })
    );
    registerCommandHandler(ListRunsByRound, ListRunsByRoundHandler);
    return Promise.resolve(container);
}