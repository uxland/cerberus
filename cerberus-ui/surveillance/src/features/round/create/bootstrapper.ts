import { addRoute, registerRouteComponent, store } from "@cerberus/core";
import { SurveillanceRoundsEditor } from "./component";
import { Container } from "inversify";
import {useGetRoundEditionData} from "./get-round-edition-data.ts";


export const useCreateRound = (container: Container) => {
    registerRouteComponent(SurveillanceRoundsEditor.name, SurveillanceRoundsEditor);
    store.dispatch(
        addRoute({
            path: "surveillance/locations/:locationId/rounds/:roundId",
            componentName: SurveillanceRoundsEditor.name,
            name: "round-editor"
        })
    );
    return useGetRoundEditionData(container);
}

// surveillance/rounds/new?locationId=1
// surveillance/rounds/1
