
import { RequestBase, SetState } from "@cerberus/core";
import { Run } from "./domain/model";

export class GetRun extends RequestBase<void> {
    constructor(public id: string | undefined, setState: SetState<Run>, setBusy: SetState<boolean>, setError: SetState<Error>) {
        super(setState, setBusy, setError);

    }
}



