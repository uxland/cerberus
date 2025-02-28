import { addRoute, registerCommandHandler, registerRouteComponent, store } from "@cerberus/core";
import { SurveillanceRunEditor } from "./component";
import { Container } from "inversify";
import { EditOrCreateRun } from "./command";
import { GetRun } from "./query";
import { EditOrCreateRunHanlder, GetRoundEditionDataHandler } from "./handler";

export const useCreateRun = (container: Container) => {
    registerRouteComponent(SurveillanceRunEditor.name, SurveillanceRunEditor);
    store.dispatch(
        addRoute({
            path: "surveillance/runs/:runId",
            componentName: SurveillanceRunEditor.name,
            name: "run-create"
        })
    );
    registerCommandHandler(EditOrCreateRun, EditOrCreateRunHanlder);
    registerCommandHandler(GetRun, GetRoundEditionDataHandler);
    return container;
}