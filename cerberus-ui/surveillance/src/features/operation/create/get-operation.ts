import { HandlerBase } from "@cerberus/core";
import { SurveillanceOperationFormModel } from "./domain";
import { injectable } from "inversify";
import { operationsEndpointUrl } from "../constants.ts";
import { IRequest } from "mediatr-ts";

export class GetOperation implements IRequest<SurveillanceOperationFormModel> {
    constructor(public id: string) { }
}

@injectable()
export class GetOperationHandler extends HandlerBase<SurveillanceOperationFormModel, GetOperation> {
    handle(request: GetOperation): Promise<SurveillanceOperationFormModel> {
        return this.apiClient.get<SurveillanceOperationFormModel>(`${operationsEndpointUrl}${request.id}`)
    }

}