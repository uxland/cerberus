import {Container} from "inversify";
import {requestHandler} from "mediatr-ts";
import {AddLocationByLocationIdHandler} from "./handler.ts";
import {AddLocationByLocationId} from "./query.ts";

export const bootstrapAddLocation = (container: Container) => {
  requestHandler(AddLocationByLocationId)(AddLocationByLocationIdHandler);
  // registerRouteComponent(AddLocation.name, AddLocationByLocationIdHandler);

  return Promise.resolve(container);
};
