import { OperationSummary } from "./model.ts";
import { RequestBase } from "@cerberus/core";
import { SetState } from "react";

export class ListOperations extends RequestBase<OperationSummary[]> {
    constructor(setState: OperationSummary[], setBusy: SetState<boolean>, setError: SetState<Error>) {
        super(setState, setBusy, setError);
    }
}