import { IRequest } from "mediatr-ts";
import {ScheduledRunSummary, SchedulerEvent} from "./model";

export class ListScheduledRuns implements IRequest<SchedulerEvent[]> {
    constructor() { }
}