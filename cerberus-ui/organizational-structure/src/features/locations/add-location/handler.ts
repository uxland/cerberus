import {ApiClient} from "@cerberus/shared/src";
import {inject} from "inversify";
import {IRequestHandler} from "mediatr-ts";
import {AddLocation} from "./command.ts";
import {HierarchyItem, LocationNode} from "../../state/hierarchy-item.ts";
import {store} from "@cerberus/core";
import {appendLocationItem} from "../../state/reducer.ts";

export class AddLocationHandler implements IRequestHandler<AddLocation, LocationNode> {
  constructor(
      @inject(ApiClient) private apiClient: ApiClient
  ) {}

  async handle(command: AddLocation): Promise<LocationNode> {
    console.log("HANDLER: Add location");

    const location = await this.createLocation(command);
    return await this.pushLocationToState(location);
  }

  private async createLocation(cmd: AddLocation): Promise<LocationNode> {
    try {
      const location = await this.apiClient.post<HierarchyItem>('/locations',{
        body:cmd as any
      })
      return {...location, children: []};
    }
    catch (e) {
      //Todo: handle error
    }
  }

  private async pushLocationToState(location: LocationNode): Promise<LocationNode> {
    store.dispatch(appendLocationItem(location));
    return location;
  }
}
