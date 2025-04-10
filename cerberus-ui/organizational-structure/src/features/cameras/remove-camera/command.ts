import { IRequest } from "mediatr-ts";

export class DeleteCamera implements IRequest<void> {
  constructor(public id: string) { }
}