import { HandlerBase } from "@cerberus/core";
import { DeleteOperation } from "./command";
import { operationsEndpointUrl } from "../constants";
import { injectable } from "inversify";

@injectable()
export class DeleteOperationHandler extends HandlerBase<void, DeleteOperation> {
    handle(request: DeleteOperation): Promise<void> {
        return this.deleteOperation(request);
    }

    deleteOperation(request: DeleteOperation): Promise<void> {
        //Ask user for confirmation
        return this.apiClient.delete(`${operationsEndpointUrl}${request.id}`);
    }
}