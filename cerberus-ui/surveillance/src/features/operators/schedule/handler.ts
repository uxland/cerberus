import { HandlerBase } from "@cerberus/core";
import { ListScheduledRuns } from "./query";
import { ScheduledRunSummary } from "./model";
import { surveillanceEndpointUrl } from "../../constants";

export class ListShceduledRunsHandler extends HandlerBase<ScheduledRunSummary[], ListScheduledRuns> {
    async handle(request: ListScheduledRuns): Promise<ScheduledRunSummary[]> {
        return this.apiClient.get<ScheduledRunSummary[]>(`${surveillanceEndpointUrl}operators/schedule`);
    }

}