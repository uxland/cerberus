import {IRequest} from "mediatr-ts";

export class AddLocationByLocationId implements IRequest<any> {
  constructor(public locationId: string) {}
}
