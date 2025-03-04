
import { RequestBase, SetState } from "@cerberus/core";
import { OperationRunQuestionAnswer, Run } from "../execution/domain/model";

export class SetRunInspection extends RequestBase<string> {
    constructor(public id: string | undefined, public inspectionId: string, public answers: OperationRunQuestionAnswer[], setState: SetState<Run>, setBusy: SetState<boolean>) {
        super(setState, setBusy, undefined);

    }
}



