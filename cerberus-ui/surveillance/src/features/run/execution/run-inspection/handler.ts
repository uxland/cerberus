import { HandlerBase } from "@cerberus/core";
import { Run } from "../domain/model.ts";
import { SetRunInspection } from './command.ts';
import { injectable } from "inversify";
import { InspectionRunData } from "./domain/model.ts";

@injectable()
export class SetRunInspectionHandler extends HandlerBase<Run, SetRunInspection> {
    handle(request: SetRunInspection): Promise<Run> {
        const payload = adaptRequest(request.data);
        return this.apiClient.put(`surveillance/runs/${request.data.runId}/inspections/${request.data.inspectionId}`, payload);
    }

}
const adaptRequest: (data: InspectionRunData) => RequestInit = (data: InspectionRunData) => {
    // Función recursiva para filtrar acciones que no han sido respondidas
    const filterAnsweredActions = (actions: any[]): any[] => {
        if (!actions || !Array.isArray(actions)) return [];

        return actions
            .filter(action => action.executed !== null && action.executed !== undefined)
            .map(action => ({
                description: action.description,
                executed: action.executed,
                comments: action.comments || "",
                alternatives: action.alternatives ? filterAnsweredActions(action.alternatives) : []
            }));
    };

    const answers = data.answers.reduce((acc, answer) => {
        // @ts-ignore
        acc[answer.questionId] = {
            value: answer.answer,
            actions: answer.actions ? filterAnsweredActions(answer.actions) : [],
        }
        return acc;
    }, {});

    console.log("Datos enviados al backend:", { answers, data });

    const payload = {
        answers,
        additionalComments: data.additionalComments,
        startedAt: data.startedAt || new Date().toISOString(),
    }
    return {
        body: <any>payload
    }
}