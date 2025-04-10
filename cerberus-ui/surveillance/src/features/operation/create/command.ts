import { SurveillanceOperationFormModel } from "./domain";
import { IRequest } from "mediatr-ts";

export class EditOrCreateOperation implements IRequest<void> {
    constructor(public id: string | undefined, public operation: SurveillanceOperationFormModel) { }
}

