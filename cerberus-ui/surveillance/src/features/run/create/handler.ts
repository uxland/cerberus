import { injectable } from "inversify";
import { HandlerBase } from "@cerberus/core";
import { runsEndpointUrl } from "../constants";
import {CreateRun, EditOrCreateRun} from "./command";
import { GetRun } from "./query";
import { Run } from "./domain/model";

// ??? Esta bien que el handler devuelva un string?
@injectable()
export class CreateRunHandler extends HandlerBase<string, CreateRun> {
    handle(request: CreateRun): Promise<string> {
        return this.handleRequest(request, this.createRun.bind(this));
    }

    private async createRun(request: EditOrCreateRun): Promise<string> {
        const id = await this.createRunInBackend(request);
        this.navigationService.navigateTo(`/surveillance/runs/${id}`);
        return id;
    }

    private async createRunInBackend(request: EditOrCreateRun): Promise<string> {
        const run = await this.apiClient.post<{ id: string }>(runsEndpointUrl, {
            body: <any> { roundId: request.roundId }
        });
        return run.id;
    }

}

export class GetRoundEditionDataHandler extends HandlerBase<Run, GetRun> {
    handle(request: GetRun): Promise<Run> {
        return this.handleRequest(request, () => this.apiClient.get<Run>(`${runsEndpointUrl}/${request.id}`));
    }
}