import { addRoute, registerRouteComponent, store } from "@cerberus/core";
import { SurveillanceOperationEditor } from "./component";
import { Container } from "inversify";


export const useCreateOperation = (container: Container) => {
    registerRouteComponent(SurveillanceOperationEditor.name, SurveillanceOperationEditor);
    store.dispatch(
        addRoute({
            path: "surveillance/operations/:operationId",
            componentName: SurveillanceOperationEditor.name,
            name: "operation-editor"
        })
    );
    return Promise.resolve(container);
}