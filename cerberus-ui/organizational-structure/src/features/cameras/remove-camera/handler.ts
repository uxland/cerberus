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

  constructor(@inject(ApiClient) private apiClient: ApiClient,
              @inject(ConfirmationManager) private confirmationManager: ConfirmationManager,
              @inject(NotificationService) private notificationService: NotificationService
  ) {}

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
    try {
      await this.apiClient.delete(`/cameras/${command.cameraId}`);
      this.notificationService.notifySuccess("Camera deleted successfully");
    } catch (e) {
      this.notificationService.notifyError("Error deleting camera", e.message);
      console.error(e.message);
    }
  }
} 