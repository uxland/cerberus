import {inject, injectable} from "inversify";
import {Capture} from "./model.ts";
import {ListCapturesByCameraId} from "./query.ts";
import {IRequestHandler} from "mediatr-ts";
import {ApiClient} from "@cerberus/shared/src";

@injectable()
export class Handler implements IRequestHandler<ListCapturesByCameraId, Capture[]>{
    constructor(@inject(ApiClient) private apiClient: ApiClient) {}
    async handle(query: ListCapturesByCameraId): Promise<Capture[]> {
        return this.apiClient.get<Capture[]>(`/cameras/${query.cameraId}/captures`)
    }

}