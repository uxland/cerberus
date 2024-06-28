import {Container} from "inversify";
import {addRoute, registerRouteComponent, store} from "@cerberus/core";
import {LocationPage} from "./component.tsx";
import {bootstrapShowLocationSettings} from "./show-location-settings/bootstrapper.ts";
import {bootstrapListCameraCaptures} from "./list-camera-captures/bootstrapper.ts";

export const bootstrapLocationDetail = (container: Container): Promise<Container> => {
    registerRouteComponent(LocationPage.name, LocationPage);
    store.dispatch(addRoute({path: 'locations/:id', componentName: LocationPage.name, name: 'Location'}));
    return bootstrapShowLocationSettings(container)
        .then(bootstrapListCameraCaptures);
}