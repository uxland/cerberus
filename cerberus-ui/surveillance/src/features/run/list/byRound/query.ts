import { IRequest } from "mediatr-ts";
import { RunSummary } from "../model";

export class ListRunsByRound implements IRequest<RunSummary[]> {
    constructor(public roundId: string) { }
}

