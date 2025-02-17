import { IRequest } from "mediatr-ts";
import { OperationSummary } from "./model.ts";

export class ListOperations implements IRequest<OperationSummary[]> {
    constructor(public id: string) { }
}