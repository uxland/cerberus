import { RequestBase, SetState } from "@cerberus/core";
import { SurveillanceOperationFormModel } from "./domain";

export class EditOrCreateRound extends RequestBase<void> {
    constructor(public id: string | undefined, public operation: SurveillanceOperationFormModel, setBusy: SetState<boolean>, setError: SetState<Error>) {
        super(undefined, setBusy, setError);
    }
}

