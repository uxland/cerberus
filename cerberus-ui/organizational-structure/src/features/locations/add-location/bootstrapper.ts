import {Container} from "inversify";
import {requestHandler} from "mediatr-ts";
import {AddLocationHandler} from "./handler.ts";
import {AddLocation} from "./query.ts";

export const bootstrapAddLocation = (container: Container) => {
  requestHandler(AddLocation)(AddLocationHandler);
  // registerRouteComponent(AddLocation.name, AddLocationByLocationIdHandler);

  return Promise.resolve(container);
};
