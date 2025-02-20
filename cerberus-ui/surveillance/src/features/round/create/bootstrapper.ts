import { addRoute, registerRouteComponent, store } from "@cerberus/core";
import { SurveillanceRoundsEditor } from "./component";
import { Container } from "inversify";


export const useCreateRound = (container: Container) => {
    registerRouteComponent(SurveillanceRoundsEditor.name, SurveillanceRoundsEditor);
    store.dispatch(
        addRoute({
            path: "surveillance/rounds/:roundId",
            componentName: SurveillanceRoundsEditor.name,
            name: "round-editor"
        })
    );
    return Promise.resolve(container);
}


