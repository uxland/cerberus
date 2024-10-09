import {ApiClient} from "@cerberus/shared/src";
import {inject} from "inversify";
import {IRequestHandler} from "mediatr-ts";
import {AddLocation} from "./query.ts";

export class AddLocationHandler implements IRequestHandler<AddLocation, any> {
  constructor(@inject(ApiClient) private apiClient: ApiClient) {}

  async handle(query: AddLocation): Promise<any> {
    console.log("HANDLER: Add location");

    return this.apiClient.post<any>(`/locations/${query.parentId}`, {
      body: <any>{
        name: query.name,
        parentId: query.parentId,
      },
    });
  }
}
