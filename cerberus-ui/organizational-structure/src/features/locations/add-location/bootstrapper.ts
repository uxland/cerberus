import {Container} from "inversify";
import {requestHandler} from "mediatr-ts";
import {Handler} from "./handler.ts";
import {AddLocationByLocationId} from "./query.ts";

export const bootstrapAddLocation = (container: Container) => {
  requestHandler(AddLocationByLocationId)(Handler);
  return Promise.resolve(container);
};
