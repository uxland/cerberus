import {Credentials} from "../location-detail/show-location-settings/model";

export interface IAddLocation {
  parentId: string | undefined;
  id: string | undefined;
  description: string;
  capturePattern: string | undefined;
  cameraCredentials: Credentials | undefined;
}
