import { IRequest } from "mediatr-ts";
import { Run } from "../execution/domain/model";

export class ListRuns implements IRequest<Run[]> {
    constructor(public roundId: string, public locationId: string) { }
}