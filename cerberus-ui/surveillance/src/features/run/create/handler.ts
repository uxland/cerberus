import { injectable } from "inversify";
import { HandlerBase } from "@cerberus/core";
import { runsEndpointUrl } from "../constants";
import { CreateRun } from "./command";

@injectable()
export class CreateRunHandler extends HandlerBase<string, CreateRun> {
    handle(request: CreateRun): Promise<string> {
        return this.createRun(request);
    }

    private async createRun(request: CreateRun): Promise<string> {
        const id = await this.createRunInBackend(request);
        this.navigationService.navigateTo(`/surveillance/${request.locationId}/runs/${id}`);
        return id;
    }

    private async createRunInBackend(request: CreateRun): Promise<string> {
        console.log("request", request);
        const run = await this.apiClient.post<{ id: string }>(runsEndpointUrl, {
            body: <any>{ roundId: request.roundId }
        });
        return run.id;
    }

}

