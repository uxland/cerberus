import { Capture } from './model.ts';
import { ListCapturesByCameraId } from './query.ts';
import { HandlerBase } from "@cerberus/core";


export class Handler extends HandlerBase<Capture[], ListCapturesByCameraId> {
  async handle(query: ListCapturesByCameraId): Promise<Capture[]> {
    return this.apiClient.get<Capture[]>(`/cameras/${query.cameraId}/captures`);
  }
}
