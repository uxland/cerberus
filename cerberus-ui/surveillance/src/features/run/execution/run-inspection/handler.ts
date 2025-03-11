import { HandlerBase } from "@cerberus/core";
import {SetRunInspection} from './command.ts';
export class SetRunInspectionHandler extends HandlerBase<Run, SetRunInspection>{
    handle(request: SetRunInspection): Promise<Run> {
        return this.apiClient.put(`surveillance/runs/${request.data.runId}/inspections/${request.data.inspectionId}`, request);
    }
}