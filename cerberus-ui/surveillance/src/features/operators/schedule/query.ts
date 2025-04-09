import { IRequest } from "mediatr-ts";
import { SchedulerEvent } from "./model";

export class ListScheduledRuns implements IRequest<SchedulerEvent[]> {
    constructor() { }
}