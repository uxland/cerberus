import {IRequestHandler} from "mediatr-ts";
import {ListOperations} from "./query.ts";
import {OperationSummary} from "./model.ts";

export class ListOperationsHandler implements IRequestHandler<ListOperations, OperationSummary[]> {
    async handle(value: ListOperations): Promise<OperationSummary[]> {
        return [];
    }
}