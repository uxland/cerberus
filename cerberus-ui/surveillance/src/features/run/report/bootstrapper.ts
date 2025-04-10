import { addRoute, registerRouteComponent, store } from "@cerberus/core";
import { RunReportView } from "./component.tsx";
import { Container } from "inversify";

export const useReportRun = (container: Container) => {
    registerRouteComponent(RunReportView.name, RunReportView);
    store.dispatch(
        addRoute({
            path: "surveillance/locations/:locationId/rounds/:roundId/runs/:runId",
            componentName: RunReportView.name,
            name: "run-report",
        })
    );
    return Promise.resolve(container);
}