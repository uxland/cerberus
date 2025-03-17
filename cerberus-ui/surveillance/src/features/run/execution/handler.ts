import { GetRun } from "./query";
import { HandlerBase } from "@cerberus/core";
import { Run } from "./domain/model";
import { runsEndpointUrl } from "../constants";
import { injectable } from "inversify";

@injectable()
export class GetRunEditionDataHandler extends HandlerBase<Run, GetRun> {
    handle(request: GetRun): Promise<Run> {
        return this.apiClient.get<Run>(`${runsEndpointUrl}${request.id}`);
    }
}

