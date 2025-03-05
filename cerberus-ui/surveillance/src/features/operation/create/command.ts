import { RequestBase } from "@cerberus/core";
import { SurveillanceOperationFormModel } from "./domain";
import { IRequest } from "mediatr-ts";

export class EditOrCreateOperation extends RequestBase<void> implements IRequest<void> {
    constructor(public id: string | undefined, public operation: SurveillanceOperationFormModel) {
        super();
    }
}

