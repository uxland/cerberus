import {IRequest} from "mediatr-ts";
import {Credentials} from "../../locations/location-detail/show-location-settings/model";
import {LocationNode} from "../../state/hierarchy-item.ts";

export class AddCamera implements IRequest<LocationNode> {
  constructor(
    public id: string | undefined,
    public parentId: string | undefined,
    public description: string,
    public capturePattern: string,
    public url: string | undefined,
    public cameraCredentials: Credentials | undefined,
    public brandName: string | undefined,
    public modelName: string | undefined,
    public price: number | undefined,
  ) {}
}
