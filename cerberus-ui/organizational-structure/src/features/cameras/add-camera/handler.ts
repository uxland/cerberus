import {store} from "@cerberus/core";
import {ApiClient} from "@cerberus/shared/src";
import {inject, injectable} from "inversify";
import {IRequestHandler} from "mediatr-ts";
import {LocationNode} from "../../state/hierarchy-item.ts";
import {appendLocationItem} from "../../state/reducer.ts";
import {AddCamera} from "./command.ts";

@injectable()
export class AddCameraHandler
  implements IRequestHandler<AddCamera, LocationNode>
{
  constructor(@inject(ApiClient) private apiClient: ApiClient) {}

  async handle(command: AddCamera): Promise<LocationNode> {
    const camera = await this.createCamera(command);
    return await this.pushLocationToState(camera);
  }

  private async createCamera(cmd: AddCamera): Promise<LocationNode> {
    try {
      const camera = await this.apiClient.post<string>("/cameras", {
        body: cmd as any,
      });
      return {...JSON.parse(camera), children: []};
    } catch (e) {
      console.log(e);
      throw e
      //Todo: handle error
    }
  }

  private async pushLocationToState(
    location: LocationNode
  ): Promise<LocationNode> {
    store.dispatch(appendLocationItem(location));
    return location;
  }
}
