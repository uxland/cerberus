import { addRoute, registerRouteComponent, store } from "@cerberus/core";
import { SurveillanceRunEditor } from "./component";
import { Container } from "inversify";
import { GetRun } from "./query";
import { GetRunEditionDataHandler } from "./handler";
import { registerCommandHandler } from "@cerberus/core";
// import { SetRunInspection } from "./command";
import { useStartRun } from "./start";
import { useRunInspection } from "./run-inspection/bootstraper.ts";

export const useExecuteRun = (container: Container) => {
    registerRouteComponent(SurveillanceRunEditor.name, SurveillanceRunEditor);
    store.dispatch(
        addRoute({
            path: "surveillance/runs/:runId",
            componentName: SurveillanceRunEditor.name,
            name: "run-execution"
        })
    );
    registerCommandHandler(GetRun, GetRunEditionDataHandler);
    // registerCommandHandler(SetRunInspection, SetRunInspectionHandler);
    return useStartRun(container)
        .then(useRunInspection);
}