import { HandlerBase } from "@cerberus/core";
import { DeleteOperation } from "./command";
import { operationsEndpointUrl } from "../constants";
import { injectable } from "inversify";

@injectable()
export class DeleteOperationHandler extends HandlerBase<void, DeleteOperation> {
    async handle(request: DeleteOperation): Promise<void> {
        await this.askForConfirmation(request) ? await this.deleteOperation(request) : null;
    }

    private async askForConfirmation(request: DeleteOperation): Promise<boolean> {
        const message = `Are you sure you want to delete operation: ${request.id}?`;
        const confirmationResult = await this.interactionService.confirmMessage(message);
        return confirmationResult.confirmed;
    }

    deleteOperation(request: DeleteOperation): Promise<void> {
        return this.apiClient.delete(`${operationsEndpointUrl}${request.id}`);
    }


}