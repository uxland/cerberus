import { addRoute, registerCommandHandler, registerRouteComponent, store } from "@cerberus/core";
import { StartRunComponent } from "./component";
import { Container } from "inversify";
import { useGetRunStartData } from "./get-run-start-data";
import { StartRun } from "./command";
import { StartRunHandler } from "./handler";

export const useStartRun = (container: Container) => {
    registerRouteComponent(StartRunComponent.name, StartRunComponent);
    store.dispatch(
        addRoute({
            path: "surveillance/rounds/:roundId/run",
            componentName: StartRunComponent.name,
            name: "run-starter"
        })
    );
    registerCommandHandler(StartRun, StartRunHandler);
    return useGetRunStartData(container);
}