import { HandlerBase } from "@cerberus/core";
import { DeleteRound } from "./command";
import { roundsEndpointUrl } from "../constants";
import { injectable } from "inversify";

@injectable()
export class DeleteRoundHandler extends HandlerBase<void, DeleteRound> {
    async handle(request: DeleteRound): Promise<void> {
        await this.askForConfirmation(request) ? await this.deleteRound(request) : null;
    }

    private async askForConfirmation(request: DeleteRound): Promise<boolean> {
        const message = `Are you sure you want to delete round: ${request.id}?`;
        const confirmationResult = await this.interactionService.confirmMessage(message);
        return confirmationResult.confirmed;
    }

    deleteRound(request: DeleteRound): Promise<void> {
        return this.apiClient.delete(`${roundsEndpointUrl}${request.id}`);
    }
}