import { injectable } from "inversify";
import { HandlerBase } from "@cerberus/core";
import { roundsEndpointUrl } from "../constants";
import { EditOrCreateRound } from "./command";

@injectable()
export class EditCreateRoundHandler extends HandlerBase<void, EditOrCreateRound> {
    handle(request: EditOrCreateRound): Promise<void> {
        return this.editOrCreateRound(request);
    }

    private async editOrCreateRound(request: EditOrCreateRound): Promise<void> {
        console.log("Send Round:", request.round);
        const task = request.id ? this.editRound(request) : this.createRound(request);
        await task;
        this.navigationService.navigateBack();
    }

    private async editRound(request: EditOrCreateRound): Promise<void> {
        return this.apiClient.put<void>(`${roundsEndpointUrl}/${request.id}`, { body: <any>request.round });
    }

    private async createRound(request: EditOrCreateRound): Promise<void> {
        return this.apiClient.post<void>(roundsEndpointUrl, { body: <any>request.round });
    }
}