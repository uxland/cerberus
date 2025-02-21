import { Container } from "inversify";
import { bootstrapLocationDetail } from "./location-detail/bootstrapper.ts";
import { bootstrapAddLocation } from "./add-location/bootstrapper.ts";
import {bootstrapListLocationSubHierarchy} from "./list-location-sub-hiearchy";

export const bootstrapLocations = (container: Container): Promise<Container> => {
    return bootstrapLocationDetail(container)
        .then(bootstrapAddLocation)
        .then(bootstrapListLocationSubHierarchy);
}