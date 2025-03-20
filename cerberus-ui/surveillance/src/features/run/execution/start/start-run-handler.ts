import { injectable } from "inversify";
import { StartRun } from "./command.ts";
import { HandlerBase } from "@cerberus/core";
import { Run } from '../domain/model.ts'

@injectable()
export class StartRunHandler extends HandlerBase<Run, StartRun> {
    handle(request: StartRun): Promise<Run> {
        return this.apiClient.put<Run>(`surveillance/runs/${request.id}:start`, {});
    }
}