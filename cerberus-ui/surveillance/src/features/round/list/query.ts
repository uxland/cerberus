import { RoundSummary } from "./model.ts";
import { RequestBase, SetState } from "@cerberus/core";

export class ListRounds extends RequestBase<RoundSummary[]> {
    constructor(public rootLocationId: string, setState: SetState<RoundSummary[]>, setBusy: SetState<boolean>, setError: SetState<Error>) {
        super(setState, setBusy, setError);
    }
}
