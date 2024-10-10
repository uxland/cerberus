import {IRequest} from "mediatr-ts";
import {Credentials} from "../location-detail/show-location-settings/model.ts";

export class AddLocation implements IRequest<any> {
  constructor(
    public parentId: string | undefined,
    public id: string | undefined,
    public description: string,
    public capturePattern: string | undefined,
    public cameraCredentials: Credentials | undefined
  ) {}
}
