import {Container} from "inversify";
import {bootstrapLocationDetail} from "./location-detail/boostrapper.ts";

export const bootstrapLocations = (container: Container): Promise<Container> => {
    return bootstrapLocationDetail(container);
}