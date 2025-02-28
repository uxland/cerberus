import { injectable } from "inversify";
import { HandlerBase } from "@cerberus/core";
import { runsEndpointUrl } from "../constants";
import { EditOrCreateRun } from "./command";
import { GetRun } from "./query";
import { Run } from "./domain/model";

// ??? Esta bien que el handler devuelva un string?
@injectable()
export class EditOrCreateRunHanlder extends HandlerBase<string, EditOrCreateRun> {
    handle(request: EditOrCreateRun): Promise<string> {
        return this.handleRequest(request, this.editOrCreateRun.bind(this));
    }

    private async editOrCreateRun(request: EditOrCreateRun): Promise<string> {
        const id = request.run ? await this.editRun(request) : await this.createRun(request);
        return id;
    }

    private async createRun(request: EditOrCreateRun): Promise<string> {
        const run = await this.apiClient.post<{ id: string }>(runsEndpointUrl, {
            body: { roundId: request.roundId }
        });
        return run.id;
    }

    private async editRun(request: EditOrCreateRun): Promise<string> {
        await this.apiClient.put<void>(`${runsEndpointUrl}/${request.run.id}`, {
            body: <any>request.run
        });
        return request.run.id;
    }
}

export class GetRoundEditionDataHandler extends HandlerBase<Run, GetRun> {
    handle(request: GetRun): Promise<Run> {
        return this.handleRequest(request, () => this.apiClient.get<Run>(`${runsEndpointUrl}/${request.id}`));
    }
}