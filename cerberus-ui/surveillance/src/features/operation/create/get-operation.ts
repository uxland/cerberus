import {RequestBase, SetState, HandlerBase} from "@cerberus/core";
import {SurveillanceOperationFormModel} from "./domain";
import {injectable} from "inversify";
import {operationsEndpointUrl} from "../constants.ts";

export class GetOperation extends RequestBase<SurveillanceOperationFormModel> {
    constructor(public id: string, setState: SetState<SurveillanceOperationFormModel>, setBusy: SetState<boolean>, setError: SetState<Error>) {
        super(setState, setBusy, setError);
    }
}

@injectable()
export class GetOperationHandler extends HandlerBase<SurveillanceOperationFormModel, GetOperation> {
    handle(request: GetOperation): Promise<SurveillanceOperationFormModel> {
        return  this.handleRequest(request, () => this.apiClient.get<SurveillanceOperationFormModel>(`${operationsEndpointUrl}${request.id}`))
    }

}