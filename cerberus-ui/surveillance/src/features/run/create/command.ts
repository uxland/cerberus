
import { RequestBase, SetState } from "@cerberus/core";

export class CreateRun extends RequestBase<string> {
    constructor(public roundId: string | undefined, setBusy: SetState<boolean>) {
        super(undefined, setBusy, undefined);

    }
}



