import { HandlerBase } from "@cerberus/core";
import { Run } from "../domain/model.ts";
import { SetRunInspection } from './command.ts';
import { injectable } from "inversify";
import {InspectionRunData} from "./domain/model.ts";

@injectable()
export class SetRunInspectionHandler extends HandlerBase<Run, SetRunInspection> {
    handle(request: SetRunInspection): Promise<Run> {
        const payload = adaptRequest(request.data);
        return this.apiClient.put(`surveillance/runs/${request.data.runId}/inspections/${request.data.inspectionId}`, payload);
    }

}
const adaptRequest: (data: InspectionRunData) => RequestInit = (data: InspectionRunData) => {
    const answers = data.answers.reduce((acc, answer) => {
        acc[answer.questionId] = answer.answer;
        return acc;
    }, {});
    const payload = {
        answers,
        additionalComments: data.additionalComments,
        startedAt: data.startedAt || new Date().toISOString(),
    }
    return {
        body: <any>payload
    }
}