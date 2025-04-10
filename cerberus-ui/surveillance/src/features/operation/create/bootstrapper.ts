import {addRoute, registerCommandHandler, registerRouteComponent, store} from "@cerberus/core";
import { SurveillanceOperationEditor } from "./component";
import { Container } from "inversify";

import {EditCreateOperationHandler} from "./handler.ts";
import { EditOrCreateOperation} from './command.ts'
import {GetOperation, GetOperationHandler} from "./get-operation.ts";

export const useCreateOperation = (container: Container) => {
    registerRouteComponent(SurveillanceOperationEditor.name, SurveillanceOperationEditor);
    store.dispatch(
        addRoute({
            path: "surveillance/operations/:operationId",
            componentName: SurveillanceOperationEditor.name,
            name: "operation-editor"
        })
    );
    registerCommandHandler(EditOrCreateOperation, EditCreateOperationHandler);
    registerCommandHandler(GetOperation, GetOperationHandler);
    return Promise.resolve(container);
}