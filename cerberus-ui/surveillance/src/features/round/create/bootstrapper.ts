import { addRoute, registerCommandHandler, registerRouteComponent, store } from "@cerberus/core";
import { SurveillanceRoundsEditor } from "./component";
import { Container } from "inversify";
import { useGetRoundEditionData } from "./get-round-edition-data.ts";
import { EditOrCreateRound } from "./command.ts";
import { EditCreateRoundHandler } from "./handler.ts";


export const useCreateRound = (container: Container) => {
    registerRouteComponent(SurveillanceRoundsEditor.name, SurveillanceRoundsEditor);
    store.dispatch(
        addRoute({
            path: "surveillance/locations/:locationId/rounds/:roundId",
            componentName: SurveillanceRoundsEditor.name,
            name: "round-editor"
        })
    );
    registerCommandHandler(EditOrCreateRound, EditCreateRoundHandler);
    return useGetRoundEditionData(container);
}
