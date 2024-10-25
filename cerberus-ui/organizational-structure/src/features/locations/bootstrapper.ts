import {Container} from "inversify";
import {bootstrapLocationDetail} from "./location-detail/boostrapper.ts";
import {bootstrapAddLocation} from "./add-location/bootstrapper.ts";

export const bootstrapLocations = (container: Container): Promise<Container> => {
    return bootstrapLocationDetail(container)
        .then(bootstrapAddLocation);
}