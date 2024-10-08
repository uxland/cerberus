import {ApiClient} from "@cerberus/shared/src";
import {inject, injectable} from "inversify";
import {IRequestHandler} from "mediatr-ts";
import {AddLocationByLocationId} from "./query.ts";

@injectable()
export class AddLocationByLocationIdHandler
  implements IRequestHandler<AddLocationByLocationId, any>
{
  constructor(@inject(ApiClient) private apiClient: ApiClient) {}
  async handle(query: AddLocationByLocationId): Promise<any> {
    console.log("HANDLER: Add location");

    // return this.apiClient.post<any>(`/locations/${query.locationId}`, {});
  }
}
