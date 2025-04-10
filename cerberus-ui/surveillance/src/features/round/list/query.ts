import { RoundSummary } from "./model.ts";
import { IRequest } from "mediatr-ts";
export class ListRounds implements IRequest<RoundSummary[]> {
    constructor(public rootLocationId: string) { }
}
