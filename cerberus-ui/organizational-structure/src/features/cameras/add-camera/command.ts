import {IRequest} from "mediatr-ts";
import {Credentials} from "../../locations/location-detail/show-location-settings/model";

export class AddCamera implements IRequest<any> {
  constructor(
    public parentId: string | undefined,
    public id: string | undefined,
    public description: string,
    public url: string | undefined,
    public cameraCredentials: Credentials | undefined
  ) {}
}