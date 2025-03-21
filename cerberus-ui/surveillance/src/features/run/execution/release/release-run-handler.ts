import {HandlerBase} from "@cerberus/core";
import {ReleaseRun} from "./command.ts";
import {runsEndpointUrl} from "../../constants.ts";

export class ReleaseRunHandler extends HandlerBase<void, ReleaseRun> {
    async handle(request: ReleaseRun): Promise<void> {
        await this.apiClient.put(`${runsEndpointUrl}${request.id}:release`, {body: <any>{additionalComments: request.additionalComments}});
        this.navigationService.navigateBack()
    }


}