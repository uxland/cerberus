import { injectable } from "inversify";
import { EditOrCreateOperation } from "./command.ts";
import { HandlerBase } from "@cerberus/core";
import { operationsEndpointUrl } from "../constants.ts";

@injectable()
export class EditCreateOperationHandler extends HandlerBase<void, EditOrCreateOperation> {
    handle(request: EditOrCreateOperation): Promise<void> {
        console.log("requestttt", request);

        return this.editOrCreateOperation(request);
    }

    private async editOrCreateOperation(request: EditOrCreateOperation): Promise<void> {
        const task = request.id ? this.editOperation(request) : this.createOperation(request);
        await task;
        this.navigationService.navigateBack()
    }


    private async editOperation(request: EditOrCreateOperation): Promise<void> {
        return this.apiClient.put<void>(`${operationsEndpointUrl}${request.id}`, { body: <any>request.operation });
    }

    private async createOperation(request: EditOrCreateOperation): Promise<void> {
        return this.apiClient.post<void>(operationsEndpointUrl, { body: <any>request.operation });
    }

}