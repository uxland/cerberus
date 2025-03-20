import { addRoute, registerRouteComponent, store } from "@cerberus/core";
import { SurveillanceRunEditor } from "./component";
import { Container } from "inversify";
import { GetRun } from "./query";
import { GetRunEditionDataHandler } from "./handler";
import { registerCommandHandler } from "@cerberus/core";
import { useStartRun } from "./start";
import { useRunInspection } from "./run-inspection/bootstraper.ts";
import {useReleaseRun} from "./release";

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
    return useStartRun(container)
        .then(useRunInspection)
        .then(useReleaseRun);
}