import { RequestBase, SetState } from "@cerberus/core";
import { Round } from "./domain";

export class EditOrCreateRound extends RequestBase<void> {
    constructor(public id: string | undefined, public round: Round, setBusy: SetState<boolean>, setError: SetState<Error>) {
        super(undefined, setBusy, setError);
    }
}

