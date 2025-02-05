import {IRequest} from "mediatr-ts";

export class DeleteCamera implements IRequest<void> {
  constructor(public cameraId: string, public description: string) {}
}