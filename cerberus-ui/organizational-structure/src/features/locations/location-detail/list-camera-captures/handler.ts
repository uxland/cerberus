import {Capture} from './model.ts';
import {ListCapturesByCameraId} from './query.ts';
import {HandlerBase} from "@cerberus/core";


export class Handler extends HandlerBase<Capture[], ListCapturesByCameraId>{
    handle(query: ListCapturesByCameraId): Promise<Capture[]> {
      return this.handleRequest<ListCapturesByCameraId>(
          query,
          async (request) => this.apiClient.get<Capture[]>(`/cameras/${request.cameraId}/captures`)
      );
    }

}