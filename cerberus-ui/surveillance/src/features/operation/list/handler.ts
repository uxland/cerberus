import { ListOperations } from "./query.ts";
import { OperationSummary } from "./model.ts";
import { injectable } from "inversify";
import {HandlerBase} from "@cerberus/core";
import {operationsEndpointUrl} from "../constants.ts";

@injectable()
export class ListOperationsHandler extends HandlerBase<OperationSummary[], ListOperations> {
    handle(_request: ListOperations): Promise<OperationSummary[]> {
        return this.apiClient.get<OperationSummary[]>(operationsEndpointUrl);
    }

}