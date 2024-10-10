import {Container} from "inversify";
import {requestHandler} from "mediatr-ts";
import {AddLocationHandler} from "./handler.ts";
import {AddLocation} from "./command.ts";

export const bootstrapAddLocation = (container: Container) => {
  requestHandler(AddLocation)(AddLocationHandler);
  return Promise.resolve(container);
};
