import { OperationSummary } from "./model.ts";
import {RequestBase} from "@cerberus/core";

export class ListOperations extends RequestBase<OperationSummary[]> {

}