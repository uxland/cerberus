import { addRoute, registerRouteComponent, registerCommandHandler, store } from "@cerberus/core";
import { Container } from "inversify";
import { ListOperations } from "./query";
import { ListOperationsHandler } from "./handler";
import { OperationsView } from "./component";

export const useListOperations = (container: Container) => {
    registerCommandHandler(ListOperations, ListOperationsHandler);
    registerRouteComponent(OperationsView.name, OperationsView);
    store.dispatch(
        addRoute({
            path: "surveillance/operations",
            componentName: OperationsView.name,
            name: "operations-list",
        })
    );
    return Promise.resolve(container);
}