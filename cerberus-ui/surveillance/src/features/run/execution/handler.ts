import { GetRun } from "./query";
import { HandlerBase } from "@cerberus/core";
import { Run } from "./domain/model";
import { runsEndpointUrl } from "../constants";

export class GetRunEditionDataHandler extends HandlerBase<Run, GetRun> {
    handle(request: GetRun): Promise<Run> {
        return this.handleRequest(request, () => this.apiClient.get<Run>(`${runsEndpointUrl}/${request.id}`));
    }
}