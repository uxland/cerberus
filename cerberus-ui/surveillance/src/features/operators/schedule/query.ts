import { IRequest } from "mediatr-ts";
import { ScheduledRunSummary } from "./model";

export class ListScheduledRuns implements IRequest<ScheduledRunSummary[]> {
    constructor() { }
}