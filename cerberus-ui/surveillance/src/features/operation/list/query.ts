import { OperationSummary } from "./model.ts";
import { IRequest } from "mediatr-ts";

export class ListOperations implements IRequest<OperationSummary[]> {
    constructor() { }
}