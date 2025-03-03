import { addRoute, registerCommandHandler, registerRouteComponent, store } from "@cerberus/core";
import { SurveillanceRunEditor } from "./component";
import { Container } from "inversify";
import { CreateRun } from "./command";
import { GetRun } from "./query";
import { CreateRunHandler, GetRoundEditionDataHandler } from "./handler";

export const useCreateRun = (container: Container) => {
    registerRouteComponent(SurveillanceRunEditor.name, SurveillanceRunEditor);
    store.dispatch(
        addRoute({
            path: "surveillance/runs/:runId",
            componentName: SurveillanceRunEditor.name,
            name: "run-create"
        })
    );
    registerCommandHandler(CreateRun, CreateRunHandler);
    registerCommandHandler(GetRun, GetRoundEditionDataHandler);
    return container;
}