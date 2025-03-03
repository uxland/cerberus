
import { RequestBase, SetState } from "@cerberus/core";
import { Run } from "./domain/model";

export class CreateRun extends RequestBase<string> {
    constructor(public roundId: string | undefined, setBusy: SetState<boolean>) {
        super(undefined, setBusy, undefined);

    }
}



