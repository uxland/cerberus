import {IRequest} from "mediatr-ts";

export class AddLocation implements IRequest<any> {
  constructor(public name: string, public parentId: string) {}
}
