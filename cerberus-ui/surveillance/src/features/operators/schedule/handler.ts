import { HandlerBase } from "@cerberus/core";
import { ListScheduledRuns } from "./query";
import {ScheduledRunSummary, SchedulerEvent, toEvents} from "./model";
import { surveillanceEndpointUrl } from "../../constants";

export class ListShceduledRunsHandler extends HandlerBase<SchedulerEvent[], ListScheduledRuns> {
    async handle(request: ListScheduledRuns): Promise<SchedulerEvent[]> {
        return this.apiClient.get<ScheduledRunSummary[]>(`${surveillanceEndpointUrl}operators/schedule`)
            .then(toEvents);
    }

}