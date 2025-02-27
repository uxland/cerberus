
import { RequestBase, SetState } from "@cerberus/core";

export class CreateRun extends RequestBase<void> {
    constructor(public id: string | undefined, public roundId: string, setBusy: SetState<boolean>, setError: SetState<Error>) {
        super(undefined, setBusy, setError);

    }
}



