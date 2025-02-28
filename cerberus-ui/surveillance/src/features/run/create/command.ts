
import { RequestBase, SetState } from "@cerberus/core";
import { Run } from "./domain/model";

export class EditOrCreateRun extends RequestBase<void> {
    constructor(public roundId: string | undefined, public run: Run | undefined, setBusy: SetState<boolean>, setError: SetState<Error>) {
        super(undefined, setBusy, setError);

    }
}



