import {RequestBase, SetState} from "@cerberus/core";
import {SurveillanceOperationFormModel} from "./domain";

export class EditOrCreateOperation extends RequestBase<void> {
    constructor(public id: string | undefined,  public operation: SurveillanceOperationFormModel, setBusy: SetState<boolean>, setError: SetState<Error>) {
        super(undefined, setBusy, setError);
    }
}

