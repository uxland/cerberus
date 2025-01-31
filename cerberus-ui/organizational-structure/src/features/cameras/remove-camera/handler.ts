import { inject, injectable } from "inversify";
import { IRequestHandler } from "mediatr-ts";
import { ApiClient } from "@cerberus/shared/src";
import { DeleteCamera } from "./command";
import {ConfirmationManager, ConfirmOptions} from "@cerberus/core";
import {NotificationService} from "@uxland/react-services";

const options: ConfirmOptions = {
  title: "Delete Camera",
  message: "Are you sure you want to delete this camera?",
  availableResponses: ["yes", "no"]
}

// Inyectable
@injectable()
export class DeleteCameraHandler implements IRequestHandler<DeleteCamera, void> {

  // Inyección del cliente API mediante el constructor
  constructor(@inject(ApiClient) private apiClient: ApiClient,
              @inject(ConfirmationManager) private confirmationManager: ConfirmationManager,
              @inject(NotificationService) private notificationService: NotificationService
  ) {}

  // Método que maneja el comando `DeleteCamera`
  async handle(command: DeleteCamera): Promise<void> {
    const confirmed = await this.removalConfirmed()
    if(confirmed) {
      await this.removeCamera(command)
    }

  }

  async removalConfirmed(): Promise<boolean> {
    const confirmation = await this.confirmationManager.confirm(options)
    return confirmation === "yes"
  }
  async removeCamera(command: DeleteCamera): Promise<void> {
    // Llamada a la API para eliminar la cámara //funciona
    try {
      await this.apiClient.delete(`/cameras/${command.cameraId}`)
    }
    catch (e) {
      console.log(e)
      this.notificationService.notifyError("Error deleting camera")
    }
    this.notificationService.notifySuccess("Camera deleted successfully")
  }
}