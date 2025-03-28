import { IRequest } from "mediatr-ts";
import { RunSummary } from "../model";

export class ListRunsByLocation implements IRequest<RunSummary[]> {
    constructor(public locationId: string) { }
}