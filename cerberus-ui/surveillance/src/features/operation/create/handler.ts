import { injectable } from "inversify";
import {EditOrCreateOperation} from "./command.ts";
import {HandlerBase} from "@cerberus/core";
import {operationsEndpointUrl} from "../constants.ts";
import {surveillanceEndpointUrl} from "../../constants.ts";

@injectable()
export class EditCreateOperationHandler extends HandlerBase<void, EditOrCreateOperation> {
    handle(request: EditOrCreateOperation): Promise<void> {
       return  this.handleRequest(request, this.editOrCreateOperation.bind(this));
    }

    private async editOrCreateOperation(request: EditOrCreateOperation): Promise<void> {
        const task = request.id ? this.editOperation(request) : this.createOperation(request);
        await task;
        this.navigationService.navigateBack()
    }


    private async editOperation(request: EditOrCreateOperation): Promise<void> {
        return this.apiClient.put<void>(`${surveillanceEndpointUrl}${operationsEndpointUrl}${request.id}`, request.operation);
    }

    private async createOperation(request: EditOrCreateOperation): Promise<void> {
        return this.apiClient.post<void>(`${surveillanceEndpointUrl}${operationsEndpointUrl}`, request.operation);
    }

}