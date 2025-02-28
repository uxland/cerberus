import { injectable } from "inversify";
import { HandlerBase } from "@cerberus/core";
import { runsEndpointUrl } from "../constants";
import { EditOrCreateRun } from "./command";
import { GetRun } from "./query";
import { Run } from "./domain/model";

@injectable()
export class EditOrCreateRunHanlder extends HandlerBase<void, EditOrCreateRun> {
    handle(request: EditOrCreateRun): Promise<void> {
        return this.handleRequest(request, this.editOrCreateRun.bind(this));
    }

    private async editOrCreateRun(request: EditOrCreateRun): Promise<void> {
        const task = request.run ? this.editRun(request) : this.createRun(request);
        await task;
    }

    private async createRun(request: EditOrCreateRun): Promise<void> {
        const route = await this.apiClient.post<string>(runsEndpointUrl, { body: <any>request.roundId });
        this.navigationService.navigateTo(route);
    }

    private async editRun(request: EditOrCreateRun): Promise<void> {
        return this.apiClient.put<void>(`${runsEndpointUrl}/${request.run.id}`, { body: <any>request.run });
    }
}

export class GetRoundEditionDataHandler extends HandlerBase<Run, GetRun> {
    handle(request: GetRun): Promise<Run> {
        return this.handleRequest(request, () => this.apiClient.get<Run>(`${runsEndpointUrl}/${request.id}`));
    }
}