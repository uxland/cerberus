import { injectable } from "inversify";
import { HandlerBase } from "@cerberus/core";
import { DeleteCamera } from "./command";

@injectable()
export class DeleteCameraHandler extends HandlerBase<void, DeleteCamera> {
  async handle(command: DeleteCamera): Promise<void> {
    await this.askForConfirmation(command) ? await this.removeCamera(command) : null;
  }

  private async askForConfirmation(request: DeleteCamera): Promise<boolean> {
    const message = `Are you sure you want to delete camera: ${request.id}?`;
    const confirmationResult = await this.interactionService.confirmMessage(message);
    return confirmationResult.confirmed;
  }

  private async removeCamera(command: DeleteCamera): Promise<void> {
    return this.apiClient.delete(`/cameras/${command.id}`);
  }
}