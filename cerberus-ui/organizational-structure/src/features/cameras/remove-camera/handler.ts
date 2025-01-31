import { inject, injectable } from "inversify";
import { IRequestHandler } from "mediatr-ts";
import { ApiClient } from "@cerberus/shared/src";
import { DeleteCamera } from "./command";

// Inyectable
@injectable()
export class DeleteCameraHandler implements IRequestHandler<DeleteCamera, void> {
  // Inyección del cliente API mediante el constructor
  constructor(@inject(ApiClient) private apiClient: ApiClient) {}

  // Método que maneja el comando `DeleteCamera`
  async handle(command: DeleteCamera): Promise<void> {
    // Realiza una solicitud DELETE al API para eliminar la cámara
    await this.apiClient.delete(`/cameras/${command.cameraId}`);
  }
}