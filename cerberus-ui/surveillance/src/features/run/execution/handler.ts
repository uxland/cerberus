import { GetRun } from "./query";
import { HandlerBase } from "@cerberus/core";
import { Run } from "./domain/model";
import { runsEndpointUrl } from "../constants";
import { injectable } from "inversify";
import { SetRunInspection } from "./command";

@injectable()
export class GetRunEditionDataHandler extends HandlerBase<Run, GetRun> {
    handle(request: GetRun): Promise<Run> {
        return this.handleRequest(request, () => this.apiClient.get<Run>(`${runsEndpointUrl}/${request.id}`));
    }
}


@injectable()
export class SetRunInspectionHandler extends HandlerBase<Run, SetRunInspection> {
    handle(request: SetRunInspection): Promise<Run> {
        return this.handleRequest(request, this.editRun.bind(this));
    }

    private async editRun(request: SetRunInspection): Promise<Run> {
        const run = await this.editRunInBackend(request);
        return run;
    }

    private async editRunInBackend(request: SetRunInspection): Promise<Run> {
        const response = await this.apiClient.put<{ run: Run }>(`${runsEndpointUrl}/${request.id}/inspection/${request.inspectionId}`, {
            body: <any>{ id: request.id, inspectionId: request.inspectionId, answers: request.answers }
        });
        return response.run;
    }

}
